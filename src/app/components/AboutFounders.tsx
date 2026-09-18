"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutFounders.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FOUNDERS } from "../data/founders";

const BAND_WORDS = "one voice.";

// Scroll-synced founder introduction. The portrait animates in first, then the
// name rises to meet it, then the four rows.
//
// The name straddles the top edge of its frame and inverts through
// mix-blend-mode: difference, so it stays legible over the photo and over the
// white page without knowing what is underneath. That is the Work mobile caption
// idiom (Work.module.css .captionBrand), lifted deliberately.
//
// The four rows sit beside the portrait rather than over it. They were briefly
// hung across the bottom edge on the same blend, which worked, but small type
// over an unknown photograph is the fragile end of that trick and the column
// reads cleaner. They are plain black on white now — no blend, nothing to tune
// when the real portraits land.
//
// The blend has a paint-order catch worth knowing before changing anything here:
// mix-blend-mode composites against the backdrop of the nearest ancestor
// stacking context. The blend therefore lives on the name's wrapper, not on the
// text inside it, and .inner must stay free of anything that creates a stacking
// context (transform, will-change, z-index with position) or the name would
// blend against an empty backdrop and silently do nothing.
export default function AboutFounders() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const band = root.querySelector<HTMLElement>("[data-band]");
    const bandLetters = root.querySelectorAll<HTMLElement>("[data-band-letter]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Everything at its end state. The band is the one thing that has to be
      // set rather than left alone: its CSS resting state is wiped away, which
      // is the correct no-JS fallback (a plain black heading) but the wrong
      // reduced-motion one, since reduced motion should still show the design.
      if (band) gsap.set(band, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(bandLetters, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-reveal]"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );

      // The red band on "one voice", the Intro redaction recipe (Intro.tsx) with
      // the swap word set to the same string: the band wipes left to right, then
      // the words re-surface in white on top of it, letter by letter. Two copies
      // rather than one inverting copy, because there is no way to flip type at a
      // moving edge within a single element — and mix-blend-mode is no help here,
      // white over #da0303 returns cyan, not white.
      if (band) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: band,
            start: "top 80%",
            end: "top 45%",
            scrub: true,
          },
        });
        tl.fromTo(
          band,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut", duration: 1 },
          0
        );
        // Starts at the end of the wipe so it reads as "band first, then words".
        tl.fromTo(
          bandLetters,
          { opacity: 0 },
          { opacity: 1, ease: "power3.inOut", stagger: 0.09, duration: 0.5 },
          1.0
        );
      }

      root.querySelectorAll<HTMLElement>("[data-founder]").forEach((block) => {
        const photo = block.querySelector("[data-photo]");
        const name = block.querySelector("[data-name]");
        if (!photo || !name) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 80%",
            end: "center 50%",
            scrub: 0.6,
          },
        });

        // 1) the portrait drifts up and resolves over the first ~60%
        tl.fromTo(
          photo,
          { yPercent: 14, scale: 0.9, autoAlpha: 0 },
          { yPercent: 0, scale: 1, autoAlpha: 1, ease: "none", duration: 0.6 }
        );
        // 2) only once it has landed does the name rise into place
        tl.fromTo(
          name,
          { yPercent: 70, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: "none", duration: 0.4 },
          ">"
        );

        // The four rows are not scrubbed, for the same reason the role and line
        // were not: text that scrubs backwards while you read it is unpleasant,
        // and that holds harder over four rows than it did over two.
        const rows = block.querySelectorAll<HTMLElement>("[data-line-row]");
        if (rows.length) {
          gsap.fromTo(
            rows,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: { trigger: block, start: "top 55%" },
            }
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.founders} id="founders">
      <div className="container">
        <header className={styles.head}>
          <h2 className={`text-statement ${styles.title}`} data-reveal>
            Two founders,
            <br />
            <span className={styles.swap}>
              {/* The accessible copy. It ends up under the band, which is why the
                  band's own letters are hidden from the reader. */}
              <span className={styles.baseWord}>{BAND_WORDS}</span>
              <span className={styles.band} data-band aria-hidden="true">
                <span className={styles.bandText}>
                  {BAND_WORDS.split("").map((ch, i) => (
                    <span key={i} className={styles.bandLetter} data-band-letter>
                      {ch === " " ? " " : ch}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </h2>
        </header>
      </div>

      <div className={styles.list}>
        {FOUNDERS.map((f) => (
          <div
            key={f.id}
            className={`${styles.founder} ${f.align === "left" ? styles.left : styles.right}`}
            data-founder
          >
            <div className={styles.inner}>
              <div className={styles.photo} data-photo>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.photo}
                  alt=""
                  className={styles.photoImage}
                  loading="lazy"
                />
              </div>

              <div className={styles.nameWrap}>
                <h3 className={styles.name} data-name>
                  {f.name}
                </h3>
              </div>
            </div>

            <div className={styles.textCol}>
              <ul className={styles.lines}>
                {f.lines.map((row, i) => (
                  <li key={i} className={styles.lineRow}>
                    <span className={styles.lineRowInner} data-line-row>
                      {row}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
