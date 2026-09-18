"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutOrigin.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ORIGIN_LINE } from "./aboutOriginLine";

// The origin story (World.md §2, the canonical origin, condensed). The diagonal
// word-wave is salvaged from the old RolunkCulture, which spent a full viewport
// on two sentences: words brighten in order of their diagonal position, so the
// light sweeps top-left to bottom-right as you scroll.
//
// The section runs untitled on purpose. Its "◆ Why we started" label came out
// with the rest of them, and it was not replaced with a heading: the hero, this
// prose and the compounds section below it are meant to read as one continuous
// piece of speech. The titled sections start at AboutBeliefs.
//
// The Ism that used to close this section now has its own full viewport in
// [[components/AboutCompounds]].
const PARAGRAPHS = [
  "For as long as we have been paying attention, marketing has been eating itself. Every year a new platform. Every quarter a new tactic. Every week another founder learning that the thing they spent six months building has already been replaced by something shinier.",
  "We started LineiQ because we could not find a studio doing the work we wanted to do. Work that compounds. Brands that outlast the people who built them. Systems worth more every year instead of less.",
];

export default function AboutOrigin() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const words = gsap.utils.toArray<HTMLElement>("[data-word]", root);
    // Matches the CSS breakpoint that hides the line. It is wider than the
    // copy's own 900 on purpose: the column is a fixed measure and the line is
    // a stretched viewBox, so they close on each other as the viewport narrows.
    const line = window.matchMedia("(min-width: 1280px)").matches
      ? lineRef.current
      : null;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(words, { opacity: 1 });
      if (line) gsap.set(line, { strokeDashoffset: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Each word's diagonal distance from the section's top-left corner sets
      // its place in the wave.
      const rootRect = root.getBoundingClientRect();
      const metrics = words.map((w) => {
        const r = w.getBoundingClientRect();
        return { w, diag: r.left - rootRect.left + (r.top - rootRect.top) };
      });
      const diags = metrics.map((m) => m.diag);
      const min = Math.min(...diags);
      const span = Math.max(...diags) - min || 1;

      // The end moved from "center 42%" when the line arrived. The copy is
      // visible almost from the moment the section enters, but the line's band
      // sits ~500px below it and is only fully on screen near the bottom of the
      // old window — so the draw had nowhere to happen that you could watch.
      // Ending on the section's bottom rather than its centre buys that runway.
      // The words simply light over a slightly longer scroll; the last of them
      // still lands while the paragraph is on screen.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          end: "bottom 65%",
          scrub: 0.6,
        },
      });

      // BAND: the share of the scroll range over which a single word travels
      // from dim to lit. Words enter proportionally to their diagonal position.
      const BAND = 0.22;
      metrics.forEach(({ w, diag }) => {
        const t = (diag - min) / span;
        tl.fromTo(
          w,
          { opacity: 0.16 },
          { opacity: 1, ease: "none", duration: BAND },
          t * (1 - BAND)
        );
      });

      // The timeline is exactly 1 long (the last word starts at 1 - BAND and
      // runs for BAND), so a duration-1 tween at 0 is the sync: the pen reaches
      // the right edge on the same scroll frame as the last word lights.
      //
      // pathLength="1" on the path is what lets the dash live in CSS, where it
      // starts hidden. Measuring with getTotalLength() would mean painting the
      // finished line until hydration got round to hiding it.
      //
      // The dash is 2 path-lengths long, so hidden is offset 2 and fully drawn
      // is offset 1, not 1 and 0. The margin that buys is the whole fix for the
      // tail that used to show through the hidden state; the reasoning is in
      // AboutOrigin.module.css on .linePath.
      // LINE_START: where in the timeline the pen sets off. Not 0, and the
      // reason is geometry rather than taste. The trigger opens with the
      // section's top at 78% of the viewport, which puts the line's entry
      // point — 640 down a 805 box — about 440px below the fold. It scrolls
      // into view just under halfway through the window, and drawing before
      // then spends the gesture off screen: the line would appear to have
      // always been there. Starting late puts the whole draw on screen, and it
      // still lands on the same frame as the last word.
      //
      // autoRound: false is not optional here. CSSPlugin rounds pixel values to
      // whole numbers by default, and with pathLength normalised to 1 the whole
      // draw lives between 2 and 1 — so the rounded version has exactly two
      // frames, and the line snaps into existence halfway down the section
      // instead of drawing.
      if (line) {
        const LINE_START = 0.45;
        tl.to(
          line,
          {
            strokeDashoffset: 1,
            ease: "none",
            duration: 1 - LINE_START,
            autoRound: false,
          },
          LINE_START
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`section section--dark ${styles.origin}`}
      id="origin"
    >
      <svg
        className={styles.line}
        viewBox="0 0 1440 805"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={lineRef}
          className={styles.linePath}
          d={ORIGIN_LINE}
          pathLength="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="container">
        <div className={styles.copy}>
          {PARAGRAPHS.map((para, pi) => (
            <p key={pi} className={styles.para}>
              {para.split(" ").map((word, wi) => (
                <span key={wi}>
                  <span className={styles.word} data-word>
                    {word}
                  </span>{" "}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
