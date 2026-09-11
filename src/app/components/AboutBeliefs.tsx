"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutBeliefs.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Evidence first, claim second, laid out as a spread rather than a list.
//
// The section used to be seven convictions, each followed by a paragraph that
// restated it. That is the shape of a generated feature list: claim, then a
// sentence agreeing with the claim, seven times, nothing at stake in any of
// them. Every one could have been pasted onto a competitor's About page and
// stayed true, which is the working definition of slop.
//
// Each cell now leads with what the conviction costs us, taken from the Cost of
// Holding line of the matching House Rule (Kontrast Vault, identity/
// Principles.md). Those sentences carry euro figures, unpaid days and named
// absences, so no competitor can paste them. The convictions survive verbatim
// from the locked Beliefs.md.
//
// Five, not seven. "We don't want to be rich, we want to be wealthy" and
// "Setbacks are tuition" have no clean cost in the House Rules: the rules that
// would supply one (P9 Disqualify Fast, P8 The Wow Bar) are already spent on
// AboutRefusals below. Both claims live further down the page anyway. `cost` is
// required by the type on purpose, so a conviction without one cannot appear
// here, and if Áron writes the missing two they slot in.
//
// On the variants: every cell looks different, and every difference is
// motivated. Uniform rows made a section about us feel more important than it
// is; arbitrary variation would just be the same template with random knobs
// turned. The rule applied here is that a cell's treatment has to be earned by
// its content. The euro range leads because it is the least fakeable string on
// the page. `calm` carries the Kranky signature because it is the one
// conviction short enough to be a single word, and the styleguide is explicit
// that Kranky is for English words and never for paragraphs. The two fragments
// go dense. The one about unpaid time reads bottom-up because it is the only
// cost measured in something other than money.
type Variant = "lead" | "dense" | "signature" | "column";

interface Belief {
  /** Verbatim from Beliefs.md (locked v1). Never edit to fit the layout. */
  conviction: string;
  /** Condensed from the matching House Rule's Cost of Holding line. */
  cost: string;
  /** Which House Rule supplies the cost. Not rendered; kept so the next person
      can trace a line back to the doc without re-deriving the mapping. */
  rule: string;
  variant: Variant;
  /** Signature variant only: the single word set in Kranky, red. The rest of
      the conviction follows it at normal size. */
  signatureWord?: string;
}

const BELIEFS: Belief[] = [
  {
    conviction: "Compounding wins.",
    cost: "We forgo the €1,500 to €4,000 a month of retainer volume that most of our competitor set lives on.",
    rule: "P1 Build the Compound, Never the Tax",
    variant: "lead",
  },
  {
    conviction: "We would rather own a small world than rent a big market.",
    cost: "We hold three seats, and we leave real revenue on the table in the months we can least afford to.",
    rule: "P3 Three Seats Only",
    variant: "dense",
  },
  {
    conviction: "We compete with our last piece of work, not with anyone else.",
    cost: "We rebuild work that is already good enough, spending hours other studios would bank.",
    rule: "P8 The Wow Bar",
    variant: "dense",
  },
  {
    conviction: "Calm is the product.",
    cost: "We are absent from channels where some of our audience is, and we watch competitors appear everywhere.",
    rule: "P7 One Channel, Well",
    variant: "signature",
    signatureWord: "Calm",
  },
  {
    conviction: "Win-win, or no deal.",
    cost: "We carry ninety days of unpaid delivery risk on every pilot before anyone owes us anything.",
    rule: "P4 Earned Pay, No Refunds",
    variant: "column",
  },
];

// PLACEHOLDER. Lorem Picsum, greyscale, so the grid can be judged with a real
// image in it. This is not shippable: Principles.md §6 forbids stock imagery on
// any surface. Replace with the photograph of the printed House Rules card on
// the studio wall, and delete this comment with it.
const WALL_PHOTO =
  "https://picsum.photos/seed/lineiq-wall/1200/1500?grayscale";

const VARIANT_CLASS: Record<Variant, string> = {
  lead: styles.cellLead,
  dense: styles.cellDense,
  signature: styles.cellSignature,
  column: styles.cellColumn,
};

export default function AboutBeliefs() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

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

      // Cells reveal individually rather than as one staggered burst: the grid
      // is taller than the viewport, so a single trigger would play the lower
      // half off-screen.
      root.querySelectorAll<HTMLElement>("[data-cell]").forEach((cell) => {
        gsap.fromTo(
          cell,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: { trigger: cell, start: "top 90%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={`section ${styles.beliefs}`} id="beliefs">
      <div className="container">
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

        {/* Not a list. The order carries no meaning, and the numerals, the
            hover and the divider rules that used to expose it were all
            announcing "list", which is the one thing this section should not
            read as. The grid is the composition; nothing here is interactive,
            so nothing responds to a cursor. */}
        <div className={styles.grid}>
          {BELIEFS.map((belief) => (
            <article
              key={belief.conviction}
              className={`${styles.cell} ${VARIANT_CLASS[belief.variant]}`}
              data-cell
            >
              {belief.variant === "signature" ? (
                <>
                  <p className={styles.signature}>
                    <span className={styles.signatureWord}>
                      {belief.signatureWord}
                    </span>{" "}
                    {restAfterWord(belief.conviction, belief.signatureWord)}
                  </p>
                  <p className={styles.cost}>{belief.cost}</p>
                </>
              ) : belief.variant === "lead" ? (
                // The only cell that keeps the connective, because it is the
                // only one where the conviction follows its cost in reading
                // order. Everywhere else the conviction leads and "Because"
                // would have nothing to attach to.
                <>
                  <p className={styles.cost}>{belief.cost}</p>
                  <p className={styles.conviction}>
                    <span className={styles.because}>Because</span>{" "}
                    {lowerFirst(belief.conviction)}
                  </p>
                </>
              ) : (
                // Dense and column: conviction over cost, verbatim and
                // capitalised. The two variants differ only in type.
                <>
                  <p className={styles.convictionOver}>{belief.conviction}</p>
                  <p className={styles.cost}>{belief.cost}</p>
                </>
              )}
            </article>
          ))}

          <figure className={`${styles.cell} ${styles.cellPhoto}`} data-cell>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WALL_PHOTO}
              alt="The twelve House Rules, printed and mounted on the studio wall."
              className={styles.wallImage}
              loading="lazy"
            />
            <figcaption className={styles.wallCaption}>
              The twelve rules, on the wall. Five of them are here.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/**
 * The convictions are stored exactly as Beliefs.md locks them, capitalised as
 * standalone sentences. Reading them after "Because" needs the first letter
 * lowered, and doing it here rather than in the data keeps the doc and the
 * constant identical. "We" is the only word this ever touches.
 */
function lowerFirst(sentence: string): string {
  return sentence.charAt(0).toLowerCase() + sentence.slice(1);
}

/**
 * The signature cell sets its first word in Kranky and the remainder at normal
 * size. Falls back to the whole sentence if the word is missing or does not
 * start it, so a bad `signatureWord` degrades to plain text instead of dropping
 * copy off the page.
 */
function restAfterWord(sentence: string, word?: string): string {
  if (!word || !sentence.startsWith(word)) return sentence;
  return sentence.slice(word.length).trimStart();
}
