"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutBeliefs.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Five claims at rest; scrolling pays out the bill for one at a time.
//
// The convictions are verbatim from the locked Beliefs.md. Each cost is
// condensed from the Cost of Holding line of the matching House Rule (Kontrast
// Vault, identity/Principles.md), which is what makes them unpastable: euro
// figures, unpaid days, named absences. A competitor can lift any conviction
// here and stay true. None of them can lift a cost.
//
// This replaces a twelve-column spread with four hand-tuned cell variants. The
// content was right and the composition was not: every row looked different, so
// the section performed its own importance, which is the failure mode of an
// About page written for the studio rather than the reader. One row shape now,
// five times. Any difference between rows comes from the sentences.
//
// Five, not the seven in Beliefs.md. "We don't want to be rich, we want to be
// wealthy" and "Setbacks are tuition" are aphorisms that would survive being
// pasted onto any studio site, which is the test this section exists to fail.
// A cost could be hunted down for each, but a cost that has to be hunted for is
// not a cost being paid. `cost` is required by the type on purpose, so a
// conviction without one cannot appear here.
//
// Full rationale, including what was taken from wearedirect.co/agency and what
// was deliberately not, in docs/prd/2026-09-11-about-beliefs-scroll-reveal.md.
interface Belief {
  /** Verbatim from Beliefs.md (locked v1). Never edit to fit the layout. */
  conviction: string;
  /** Condensed from the matching House Rule's Cost of Holding line. */
  cost: string;
  /** Which House Rule supplies the cost. Not rendered; kept so the next person
      can trace a line back to the doc without re-deriving the mapping. */
  rule: string;
}

const BELIEFS: Belief[] = [
  {
    conviction: "Compounding wins.",
    cost: "We turn down the €1,500 to €4,000 a month of retainer volume that most of our competitor set lives on.",
    rule: "P1 Build the Compound, Never the Tax",
  },
  {
    conviction: "We would rather own a small world than rent a big market.",
    cost: "We hold three seats, and we leave real revenue on the table in the months we can least afford to.",
    rule: "P3 Three Seats Only",
  },
  {
    conviction: "We compete with our last piece of work, not with anyone else.",
    cost: "We rebuild work that is already good enough, spending hours other studios would bank.",
    rule: "P8 The Wow Bar",
  },
  {
    // Sourced from P6, not P7. P7's cost of holding names YouTube and Instagram
    // as channels we are absent from, and both are now the two channels we run.
    // P6 is the better line anyway: an absence cannot be checked, but a reader
    // can check our publishing pace against the actual feed in four seconds.
    conviction: "Calm is the product.",
    cost: "We publish less, and slower, than firms that mass-generate. We say no to easy volume.",
    rule: "P6 Ship No Slop",
  },
  {
    conviction: "Win-win, or no deal.",
    cost: "We carry ninety days of unpaid delivery risk on every pilot before anyone owes us anything.",
    rule: "P4 Earned Pay, No Refunds",
  },
];

/** Inactive convictions. Readable as a set, clearly secondary to the open one.
    Not the 5% black the reference uses: that is ~1.05:1 against white. */
const GHOST = "rgba(0, 0, 0, 0.3)";

export default function AboutBeliefs() {
  const rootRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    const rows = rowsRef.current;
    if (!root || !rows) return;

    // No enhancement under reduced motion. The CSS default is every row open at
    // full black on an auto height, so returning here leaves the complete
    // section, static and tall. Same fallback the no-JS case gets, and the same
    // pattern every other component on this page uses.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-reveal]"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );
    }, root);

    // Closing the rows is what turns the static fallback into the mechanic, so
    // it happens here rather than in the markup: if this effect never runs, the
    // reader still gets every cost.
    root.classList.add(styles.enhanced);

    const outers = Array.from(
      rows.querySelectorAll<HTMLElement>("[data-cost-outer]")
    );
    const costs = Array.from(rows.querySelectorAll<HTMLElement>("[data-cost]"));
    const heads = Array.from(rows.querySelectorAll<HTMLElement>("[data-head]"));

    // Resolved to real colour values, because GSAP cannot interpolate a
    // var(--token) string: handed one, it writes the literal text and the
    // colour snaps instead of tweening. The tokens stay the source of truth.
    const token = (name: string, fallback: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
      fallback;
    const RED = token("--color-red", "#da0303");
    const BLACK = token("--color-black", "#000000");

    let active = -1;
    const timelines = new Map<HTMLElement, gsap.core.Timeline>();

    const open = (index: number) => {
      if (index === active) return;
      const previous = active;
      active = index;

      outers.forEach((outer, i) => outer.classList.toggle(styles.isOpen, i === index));

      const head = heads[index];
      if (head) {
        timelines.get(head)?.kill();
        // Flash the accent, then settle. The flash is what gives the state
        // change a heartbeat without adding a decorative element to the row.
        const tl = gsap
          .timeline()
          .to(head, { color: RED, duration: 0.05 })
          .to(head, { color: BLACK, duration: 0.2, ease: "power2.out" });
        timelines.set(head, tl);
      }

      const closing = heads[previous];
      if (closing) {
        timelines.get(closing)?.kill();
        // Faster than the open, so the exit never fights the entrance.
        const tl = gsap
          .timeline()
          .to(closing, { color: GHOST, duration: 0.25, ease: "power2.out" });
        timelines.set(closing, tl);
      }
    };

    gsap.set(heads, { color: GHOST });

    /**
     * Reserve the section's height once, so it never changes again.
     *
     * The reference implementation lets the page grow and calls
     * ScrollTrigger.refresh(true) after every transition. That is not available
     * here: AboutCompounds pins directly above this section with
     * invalidateOnRefresh, and three scrubbed sections sit below it, so a
     * refresh per row-open would recompute a pin the reader has just scrolled
     * out of, mid-scroll.
     *
     * Exactly one row is ever open, so the height only ever varies by one cost
     * block. Reserving the tallest one, once, buys the same in-place push with
     * a page height that never moves.
     */
    const measure = () => {
      // Measure against every row closed, with transitions suppressed. Without
      // both, this reads a height mid-transition or one that already includes
      // an open row, and the reserved slack gets counted twice.
      const openOuter = outers.find((outer) =>
        outer.classList.contains(styles.isOpen)
      );
      rows.classList.add(styles.measuring);
      outers.forEach((outer) => outer.classList.remove(styles.isOpen));
      rows.style.height = "";
      void rows.offsetHeight;

      const closedHeight = rows.getBoundingClientRect().height;
      const tallestCost = costs.reduce(
        (max, cost) => Math.max(max, cost.scrollHeight),
        0
      );
      rows.style.height = `${Math.ceil(closedHeight + tallestCost)}px`;

      openOuter?.classList.add(styles.isOpen);
      void rows.offsetHeight;
      rows.classList.remove(styles.measuring);
    };

    const driver = ScrollTrigger.create({
      trigger: rows,
      // Deliberately late, and paired with the section's oversized padding-top.
      //
      // At "top 72%" row one's entire open window ran while the rows sat 476 to
      // 648px down the viewport, under the black of the section above, and it
      // handed off to row two within a few pixels of the black clearing. The
      // row was never once seen on white. Row one now opens around 330px down a
      // white screen and holds for ~210px of scroll before row two takes over,
      // which is the same screen time the other four get.
      start: "top 30%",
      end: "bottom 20%",
      // Refreshed last, after every default-priority trigger.
      //
      // ScrollTrigger refreshes in creation order at equal priority, and
      // AboutCompounds resolves its mode after hydration, so its pin is created
      // after this driver. Measured in creation order, this section is read at
      // its unpinned position, 150vh too high, and the whole reveal plays out
      // while the reader is still inside the pinned section above. A negative
      // priority puts this last in the queue, by which point the pin spacing is
      // applied and the rows measure where they actually are.
      refreshPriority: -1,
      onUpdate: (self) => {
        const index = Math.min(
          BELIEFS.length - 1,
          Math.floor(self.progress * BELIEFS.length)
        );
        open(index);
      },
    });

    // Re-measure on every refresh, not once at mount, and let ScrollTrigger
    // recompute this section's start and end in the same pass.
    //
    // Measuring once is not enough: AboutCompounds resolves its mode after
    // hydration and only then pins, which drops 150vh of spacer above this
    // section. A driver created before that lands 1350px early, so the whole
    // reveal plays out while the reader is still inside the pinned section and
    // is exhausted by the time the rows are on screen. refreshInit fires before
    // every trigger recalculates, so the reserved height is always in place
    // before anything measures against it.
    ScrollTrigger.addEventListener("refreshInit", measure);

    // refreshInit does the measuring, so this only has to ask for the pass.
    const setup = () => ScrollTrigger.refresh();

    // Webfonts change every one of those measurements, so wait for them.
    if (document.fonts && document.fonts.status !== "loaded") {
      void document.fonts.ready.then(setup);
    } else {
      setup();
    }

    // Progress drives the index rather than each row's own rect. Rows move when
    // a row above them opens, so a rect threshold can push a row past its own
    // trigger point and oscillate; container progress cannot, now that the
    // container height is fixed.

    // The section is an anchor target (#beliefs), so a reader can land halfway
    // down it. Opening the first row means they never find five claims with
    // nothing underneath.
    open(0);

    // Only width changes need a re-measure. Height-only changes are what a
    // mobile address bar collapse looks like, and re-measuring on those would
    // fire a refresh mid-scroll, which is the thing this section avoids.
    let lastWidth = window.innerWidth;
    let resizeTimer = 0;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", measure);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      timelines.forEach((tl) => tl.kill());
      driver.kill();
      ctx.revert();
      rows.style.height = "";
      root.classList.remove(styles.enhanced);
    };
  }, []);

  return (
    <section ref={rootRef} className={`section ${styles.beliefs}`} id="beliefs">
      <div className="container">
        <div className={styles.layout}>
          {/* Sticky, so the question stays on screen while the answers move. */}
          <header className={styles.head}>
            <h2 className={`text-section ${styles.title}`} data-reveal>
              What we believe, and what believing it costs us.
            </h2>
            <p className={styles.lead} data-reveal>
              These are not slogans and they are not negotiable. A principle that
              costs nothing is just a comfortable belief, so each one below is
              filed with the bill.
            </p>
          </header>

          {/* Not a list. No numerals, no hover, no progress rail: those were all
              announcing "list", which is the one thing this section should not
              read as. Nothing here is interactive, so nothing responds to a
              cursor. The sequence comes from the scroll. */}
          <div ref={rowsRef} className={styles.rows}>
            {BELIEFS.map((belief) => (
              <article key={belief.conviction} className={styles.row}>
                <h3 className={styles.conviction} data-head>
                  {belief.conviction}
                </h3>
                <div className={styles.costOuter} data-cost-outer>
                  <p className={styles.cost} data-cost>
                    {belief.cost}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
