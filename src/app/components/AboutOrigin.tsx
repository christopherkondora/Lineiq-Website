"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutOrigin.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const words = gsap.utils.toArray<HTMLElement>("[data-word]", root);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(words, { opacity: 1 });
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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          end: "center 42%",
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
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`section section--dark ${styles.origin}`}
      id="origin"
    >
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
