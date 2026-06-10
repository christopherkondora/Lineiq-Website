"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Manifesto.module.css";

export default function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // The slide-over itself is pure CSS: the previous section ("Stratégiától a
      // kódig") is sticky, so it parks at the top of the viewport while this
      // opaque panel scrolls up over it (see page.tsx + .manifesto z-index).
      // Here we animate the Manifesto's content — headline, copy, narrative
      // line and the red wipe — all scrubbed to scroll. The range must extend
      // PAST the full cover ("top top"): the content is centred in the 110vh
      // panel, so during the approach it sits below the fold — a range ending
      // at the cover would play everything off-screen. From top 60% to top
      // -20% the composition rides on screen the whole way, and scrub: 1
      // smooths fast flicks into a soft catch-up instead of a snap.
      // Durations below are relative weights of that range (total ≈ 2).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 60%",
          end: "top -20%",
          scrub: 1,
        },
      });

      // 1) Headline rises line by line from behind its overflow mask as it
      //    enters from below.
      tl.from(
        root.querySelectorAll("[data-head-line] > span"),
        { yPercent: 120, duration: 0.5, ease: "none", stagger: 0.15 },
        0
      );

      // 2) The running copy fades up line by line, just behind the headline.
      tl.from(
        root.querySelectorAll("[data-lead-line]"),
        { y: 24, autoAlpha: 0, duration: 0.4, ease: "none", stagger: 0.1 },
        0.3
      );

      // 3) Narrative line draws across the whole range; linear, the scroll
      //    itself is the ease.
      const line = root.querySelector<SVGPathElement>("[data-narrative-line]");
      if (line) {
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
        tl.to(line, { strokeDashoffset: 0, duration: 2, ease: "none" }, 0);
      }

      // 4) Red bar sweeps across the photo and back — the closing accent,
      //    placed in the second half so it plays after the panel has arrived.
      const block = root.querySelector("[data-red-block]");
      if (block) {
        tl.fromTo(
          block,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.5, ease: "power2.inOut" },
          0.9
        );
        tl.to(
          block,
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.6,
            ease: "power2.inOut",
          },
          1.4
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`section section--dark ${styles.manifesto}`}
      id="manifesto"
    >
      <svg
        className={styles.narrativeLine}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0 100 Q 360 20, 720 100 T 1440 100"
          stroke="var(--color-red)"
          strokeWidth="1.2"
          fill="none"
          data-narrative-line
        />
      </svg>

      <div className="container">
        <div className={styles.grid}>
          <div className={styles.copy}>
            <h2 className={`text-statement ${styles.heading}`}>
              <span className={styles.headLine} data-head-line>
                <span>We didn&apos;t lose taste to AI.</span>
              </span>
              <span className={styles.headLine} data-head-line>
                <span>We taught it ours.</span>
              </span>
            </h2>

            <p className={styles.lead}>
              <span className={styles.line1} data-lead-line>
                Magyar stúdió,{" "}
                <span className={styles.highlight}>nyugat-európai mércével.</span>
              </span>
              <span className={styles.line2} data-lead-line>
                Az AI-t mindenki használja. A különbség az{" "}
                <span className={styles.highlight}>elme</span> és az{" "}
                <span className={styles.highlight}>ízlés.</span>
              </span>
              <span className={styles.lastBlock}>
                <span className={styles.line3} data-lead-line>
                  Brand, tartalom és kód kreatív elméktől, technikai és elméleti
                </span>
                <span className={styles.line4} data-lead-line>
                  <span className={styles.highlight}>szakértelemmel.</span>
                </span>
              </span>
            </p>
          </div>

          <div className={styles.imageWrap} data-reveal>
            <div className={styles.imageBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/work/studio.jpg"
                alt="LineiQ stúdió"
                className={styles.image}
                data-reveal-image
              />
              <span className={styles.redBlock} data-red-block />
            </div>
            <p className={styles.caption}>
              <span className="text-label">Stúdió · BP</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
