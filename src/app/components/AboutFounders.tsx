"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutFounders.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FOUNDERS } from "../data/founders";
import { FRAMEWORKS, METHOD_SHAPE } from "../data/method";

const BAND_WORDS = "one voice.";

// The section enacts its own heading. "Two founders, one voice." is not a
// caption here, it is the geometry: two columns run side by side, each one a
// distinct person with their own four rows, and then the columns end and the
// method runs full-width underneath them. Two people converging into one
// system. The red band lands on "one voice" and the thing directly below it is
// the one voice.
//
// Rebuilt on 2026-09-25 from an offset composition that stacked the two
// founders in mirrored blocks across two-plus viewports. Three faults, in order
// of what they cost: the largest surface on the second half of the page was a
// photograph nobody had taken, so the section could not be finished without a
// shoot; the strongest proof the studio owns, the method built before either of
// us had a client, was set as the smallest type on the page inside the
// Limitation aside; and the mirrored blocks sprawled. Two columns plus a
// full-width method is shorter than the old composition even after absorbing
// the frameworks.
//
// The portrait slot is composed and empty. It holds the initials on a black
// mark whose frame, blend and motion are exactly what a photograph will need,
// so the commissioned shots drop in without touching the layout here. The old
// /founders/placeholder-portrait.png was a stock photograph of a man who is
// neither of us, shown twice, and it was live on the public domain. It is
// deleted rather than swapped, so it cannot return by accident.
//
// The blend has a paint-order catch worth knowing before changing anything:
// mix-blend-mode composites against the backdrop of the nearest ancestor
// stacking context. The blend therefore lives on the wrapper of the name, not
// on the text inside it, and .figure must stay free of anything that creates a
// stacking context (transform, will-change, z-index with position) or the name
// would blend against an empty backdrop and silently do nothing.
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
      // moving edge within a single element, and mix-blend-mode is no help here:
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

      // Both columns are triggered off the pair, not off themselves, so the two
      // founders resolve together. Staggering them would read as a ranking.
      const pair = root.querySelector<HTMLElement>("[data-pair]");
      if (pair) {
        const marks = pair.querySelectorAll<HTMLElement>("[data-mark]");
        const names = pair.querySelectorAll<HTMLElement>("[data-name]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pair,
            start: "top 80%",
            end: "center 55%",
            scrub: 0.6,
          },
        });

        // 1) the marks resolve, 2) only once they have landed do the names rise
        // through them. The same two-beat order the portraits had.
        tl.fromTo(
          marks,
          { yPercent: 14, scale: 0.9, autoAlpha: 0 },
          { yPercent: 0, scale: 1, autoAlpha: 1, ease: "none", duration: 0.6 }
        );
        tl.fromTo(
          names,
          { yPercent: 70, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: "none", duration: 0.4 },
          ">"
        );

        // The rows are not scrubbed. Text that scrubs backwards while you read
        // it is unpleasant, and that holds harder over four rows than over two.
        gsap.fromTo(
          pair.querySelectorAll<HTMLElement>("[data-line-row]"),
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: { trigger: pair, start: "top 55%" },
          }
        );
      }

      // The method arrives as one set, on its own trigger, after the pair has
      // settled. A per-row scrub here would turn the convergence into a second
      // piece of choreography competing with the first.
      const method = root.querySelector<HTMLElement>("[data-method]");
      if (method) {
        gsap.fromTo(
          method.querySelectorAll<HTMLElement>("[data-framework]"),
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: { trigger: method, start: "top 70%" },
          }
        );
      }
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
                  letters of the band itself are hidden from the reader. */}
              <span className={styles.baseWord}>{BAND_WORDS}</span>
              <span className={styles.band} data-band aria-hidden="true">
                <span className={styles.bandText}>
                  {BAND_WORDS.split("").map((ch, i) => (
                    <span key={i} className={styles.bandLetter} data-band-letter>
                      {/* Non-breaking, not a plain space. Each letter is its own
                          inline-block so it can be staggered, and a lone normal
                          space inside an inline-block collapses to nothing — the
                          band rendered "onevoice." while the accessible copy
                          underneath it still said "one voice." */}
                      {ch === " " ? " " : ch}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </h2>
        </header>

        <div className={styles.pair} data-pair>
          {FOUNDERS.map((f) => (
            <article key={f.id} className={styles.founder}>
              <div className={styles.figure}>
                {/* The portrait slot, on a 4:5 frame because that is what the
                    commissioned shots will be. The mark is not a gap waiting to
                    be filled, it is the same rectangle, occupied. */}
                <div className={styles.mark} data-mark aria-hidden="true">
                  <span className={styles.markInitials}>{f.initials}</span>
                </div>

                <div className={styles.nameWrap}>
                  <h3 className={styles.name} data-name>
                    {f.name}
                  </h3>
                </div>
              </div>

              <ul className={styles.lines}>
                {f.lines.map((row, i) => (
                  <li key={i} className={styles.lineRow}>
                    <span className={styles.lineRowInner} data-line-row>
                      {row}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className={styles.method} data-method>
          <p className={`text-label ${styles.methodLabel}`} data-reveal>
            What the two of us built before either of us had a client
          </p>

          <ol className={styles.frameworks}>
            {FRAMEWORKS.map((fw) => (
              <li key={fw.name} className={styles.framework} data-framework>
                <h4 className={styles.frameworkName}>{fw.name}</h4>
                <p className={styles.frameworkLine}>{fw.line}</p>
              </li>
            ))}
          </ol>

          <p className={styles.methodShape} data-reveal>
            Five of {METHOD_SHAPE.frameworks}, across {METHOD_SHAPE.layers}{" "}
            layers. The rest are not secrets, they are just not first
            impressions.
          </p>
        </div>
      </div>
    </section>
  );
}
