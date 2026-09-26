"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutRecord.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLIENTS, CLIENT_NAMES_CLEARED } from "../data/record";

// The Limitation, rebuilt on 2026-09-25 as its own viewport, and no longer a
// confession. It replaces AboutRefusals, which held three refusals and buried
// the Limitation in a 16px aside underneath them.
//
// The heading admits we have never published a case study. The rest of the
// section answers it, which is the opposite shape from the old aside.
//
// On attribution: an earlier pass said the record was Kristóf's alone and that
// Áron's name was on the method and not on this list. That was wrong.
// identity/Culture.md:109 gives Áron branding strategy, market research,
// strategic philosophy, sales and client relationships, he owns three of the
// four Deep Research pillars, and he wrote most of the frameworks. He has no
// client roster, which is a difference in kind and not in rank. The lead says
// who did what and stops there.
//
// 2026-09-26. The answer used to be a six-row prose ledger under a static
// roster. It is now the roster alone, in motion: two lanes of names drifting in
// opposite directions, set hollow and filling solid under the cursor. Reasons,
// in order of weight. The page has no logos, no portraits and no screenshots, so
// the names are the only picture it owns, and the ledger was spending most of
// the section's height talking over them. Ten names read as a body of work where
// six paragraphs read as six paragraphs. And a case study is the thing this
// heading admits we do not have, so a ledger dressed up in its place was the one
// move the section is not allowed to make. Data note in data/record.ts.
//
// Composition of the marquee, since none of it is arbitrary:
//   Two lanes, opposite directions. One lane is a ticker. Two moving against
//   each other read as a field, and the counter-motion is what stops the eye
//   from tracking a single name out to the edge.
//   Driven by the scroll, not by a clock. The lanes are still until the page
//   moves, which makes them answer the reader instead of performing at them, and
//   it means a name is never travelling when somebody has stopped to read it.
//   Solid, at a size the heading can still outrank. Set in the body sans rather
//   than in Fraunces: this is a list of names to be read at a glance, and the
//   display serif is the page's voice for sentences it wants you to slow down
//   for.
//
// Both lanes carry all ten names, and the second one starts halfway down the
// list. The first pass split them, five and five, taking every other name, and a
// lane of five short ones (I-Trap, GoldFisch, Viltor, North, TV Center) came to
// about 1500px, which is narrower than the screen it was running across: I-Trap
// was visible twice at once and the loop stopped being a roster and became a
// repeating texture. A lane holding the whole list is roughly 3600px and cannot
// do that on any monitor. The rotation is what keeps the two lanes from being
// the same line twice.
const ROTATION = Math.floor(CLIENTS.length / 2);
const LANES = [
  CLIENTS,
  [...CLIENTS.slice(ROTATION), ...CLIENTS.slice(0, ROTATION)],
];

// The track carries four copies of its lane and travels exactly -50%, which puts
// copy three where copy one began: no seam, and nothing to land on mid-name.
// Two copies would close the seam but not cover the width, and a track narrower
// than the viewport leaves a hole at the right edge on a wide screen.
const TRACK_COPIES = 4;

// How the lanes follow the scroll. Each frame the lane's velocity is the last
// frame's velocity kept at COAST, plus whatever the page just moved:
//
//   v = v * COAST + scrollDelta * GAIN
//
// which is a low-pass filter on scroll speed. Two things fall out of it. Summed
// over a gesture the lanes travel TRAVEL px for every page px, because
// GAIN / (1 - COAST) is exactly TRAVEL. And when the scroll stops, v does not:
// it decays, so the lanes carry their momentum and ease to a halt instead of
// cutting. That coast is the whole point, and COAST is where its length lives.
//
// 0.93 per frame is roughly a quarter second of rollover, which is long enough
// to read as weight and short enough that the lanes are still by the time a
// reader has settled on a name. Both constants are corrected for refresh rate in
// the tick below, or the coast would be half as long on a 120Hz screen.
const COAST = 0.93;
const TRAVEL = 0.8;

// px per frame, ~6px/sec, which is under the resolution of anything a reader can
// see. Snapped to zero there because the decay is exponential and its tail is
// arbitrarily long: measured, the visible glide is over inside half a second but
// the lanes go on creeping sub-pixel for another one, holding will-change open
// the whole time for motion nobody is watching.
const REST = 0.1;

export default function AboutRecord({ ageSentence }: { ageSentence: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const rosterRef = useRef<HTMLDivElement>(null);

  // The lanes. Not a CSS animation and not a tween, because neither has a notion
  // of "however far the reader just scrolled": this reads the page's own
  // movement every frame and hands it to the lanes.
  //
  // It runs on the GSAP ticker rather than a private rAF so it shares a frame
  // with Lenis, which is what actually moves window.scrollY on this site. Same
  // loop, so the scroll position is read after it has been written, and the
  // smoothing Lenis already applies arrives here for free.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const roster = rosterRef.current;
    if (!roster) return;

    // Parked. The stylesheet has its own reduced-motion roster, wrapped and
    // still, and a transform written from here would fight it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tracks = Array.from(
      roster.querySelectorAll<HTMLElement>(`.${styles.track}`)
    );
    if (!tracks.length) return;

    // Half the track: two of its four copies, and the distance after which the
    // lane is showing identical pixels again. Offsets wrap on it, so the lane
    // never travels far enough to run out of names.
    let spans = tracks.map((track) => track.scrollWidth / 2);
    const offsets = tracks.map(() => 0);
    const velocities = tracks.map(() => 0);

    const measure = () => {
      spans = tracks.map((track) => track.scrollWidth / 2);
    };

    // The names are web fonts, so the first measurement is of fallback metrics
    // and is wrong by however much the two families differ.
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    const ro = new ResizeObserver(measure);
    tracks.forEach((track) => ro.observe(track));

    // Nothing is injected while the section is off-screen, so scrolling past the
    // page does not wind the lanes up into a spin that plays out when the reader
    // finally arrives.
    let inView = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    io.observe(roster);

    let lastScroll = window.scrollY;

    const tick = (_time: number, deltaTime: number) => {
      const scroll = window.scrollY;
      const scrolled = scroll - lastScroll;
      lastScroll = scroll;

      // Both constants are per-60Hz-frame. On any other refresh rate the coast
      // is re-based onto this frame's actual length, and the gain follows it, so
      // the rollover lasts the same quarter second and a page px still buys
      // TRAVEL px of travel whatever the screen is doing.
      const coast = COAST ** (deltaTime / (1000 / 60));
      const gain = TRAVEL * (1 - coast);

      let moving = false;

      for (let i = 0; i < tracks.length; i++) {
        // Lanes alternate direction. Scrolling back up runs both of them
        // backwards, which is what keeps the motion feeling attached to the
        // reader's hand rather than merely triggered by it.
        const direction = i % 2 === 0 ? 1 : -1;
        let velocity = velocities[i] * coast;
        if (inView) velocity += scrolled * gain * direction;

        if (Math.abs(velocity) < REST) velocity = 0;
        velocities[i] = velocity;
        if (velocity === 0) continue;

        const span = spans[i];
        if (!span) continue;

        // Kept inside one span, and positive, so the modulo behaves when the
        // reader scrolls up and the offset goes negative.
        const offset = (((offsets[i] + velocity) % span) + span) % span;
        offsets[i] = offset;
        tracks[i].style.transform = `translate3d(${-offset}px, 0, 0)`;
        moving = true;
      }

      // Released the moment the lanes settle. will-change on a pair of
      // permanently promoted layers is a standing cost for motion that, on this
      // section, is the exception rather than the rule.
      roster.dataset.moving = moving ? "true" : "false";
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

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
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root, start: "top 72%" },
        }
      );

      // Opacity only, and deliberately so. Everything that brings this section
      // in is a rise, but the lanes read as one horizontal field and lifting
      // them vertically at the same moment the scroll is pushing them sideways
      // gives the entrance a diagonal nobody asked for.
      const roster = rosterRef.current;
      if (roster) {
        gsap.fromTo(
          roster.querySelectorAll<HTMLElement>(`.${styles.lane}`),
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.1,
            stagger: 0.14,
            ease: "power2.out",
            clearProps: "opacity",
            scrollTrigger: { trigger: roster, start: "top 85%" },
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`section section--dark ${styles.record}`}
      id="record"
    >
      <div className="container">
        <header className={styles.head}>
          <p className={`text-label ${styles.label}`} data-reveal>
            The one thing we will not dress up
          </p>
          <h2 className={`text-statement ${styles.title}`} data-reveal>
            LineiQ has never published a case study.
          </h2>
          <p className={styles.lead} data-reveal>
            That is true and we are not going to dress it up. It is also not the
            same as starting from zero. Kristóf brought the client record below.
            Áron wrote most of the twenty-two frameworks the studio runs on and
            owns the research underneath them. Different work, not different
            weight.
          </p>
        </header>

        {/* Gated on CLIENT_NAMES_CLEARED. Part of the work came through
            Viltor.hu, so those names are Viltor's to release before they are
            ours. The consent trail is in data/record.ts. */}
        {CLIENT_NAMES_CLEARED && (
          <div
            className={styles.roster}
            ref={rosterRef}
            aria-label="Clients and projects"
          >
            {LANES.map((lane, laneIndex) => (
              <div
                key={laneIndex}
                className={styles.lane}
                // The second lane is the same ten names rotated, so it is a
                // visual device and nothing else. Hidden whole, or the roster is
                // dictated twice in a different order.
                aria-hidden={laneIndex > 0 ? "true" : undefined}
              >
                <div className={styles.track}>
                  {Array.from({ length: TRACK_COPIES }, (_, copy) => (
                    <div
                      key={copy}
                      className={styles.copy}
                      // Likewise the loop copies. Only the first is read out.
                      aria-hidden={copy > 0 ? "true" : undefined}
                      data-copy={copy > 0 ? "duplicate" : "first"}
                    >
                      {lane.map((name) => (
                        <span key={name} className={styles.client}>
                          {name}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* The frameworks are not recited here. The lead above already credits
            them to Áron, AboutFounders says "Most of our 22 frameworks" and the
            frameworks ledger closes on "Five of 22, across 11 layers". Saying
            the count a fourth time in one section is how a page starts sounding
            like it only has one fact. */}
        <p className={styles.close} data-reveal>
          {ageSentence} The studio is younger than the method it runs on: we
          built the Academy and the Dream Outcome Process before anyone had paid
          us a forint, because we refuse to charge a price we cannot run a
          procedure to justify. We will still be students in two years. The one
          thing we do, we do well.
        </p>
      </div>
    </section>
  );
}
