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
      // One entrance choreography for the whole panel. The section is 110vh
      // tall with its content centred, so it fires off the SECTION's midpoint:
      // "center 85%" starts the sequence the moment the middle of the section
      // becomes visible (its centre crossing 85% down the viewport), which is
      // exactly when the centred composition arrives on screen. Everything then
      // plays as a single beat: the headline rises line by line, the copy fades
      // up line by line, the studio panel arrives, then the narrative line
      // draws and the red bar wipes across the photo.
      const headLines = root.querySelectorAll("[data-head-line] > span");
      const leadLines = root.querySelectorAll("[data-lead-line]");
      const imageWrap = root.querySelector("[data-reveal]");

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "center center", invalidateOnRefresh: true },
      });

      // 1) headline rises line by line from behind its mask
      tl.from(headLines, {
        yPercent: 120,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.12,
      });

      // 2) the running copy fades up line by line, just behind the headline
      tl.from(
        leadLines,
        { y: 24, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 },
        "-=0.5"
      );

      // 3) the studio panel arrives alongside the copy
      if (imageWrap) {
        tl.from(
          imageWrap,
          { y: 60, autoAlpha: 0, duration: 1, ease: "power3.out" },
          "-=0.7"
        );
      }

      const line = root.querySelector<SVGPathElement>("[data-narrative-line]");
      if (line) {
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
        tl.to(
          line,
          { strokeDashoffset: 0, duration: 2, ease: "power3.out" },
          "-=0.6"
        );
      }

      const block = root.querySelector("[data-red-block]");
      const image = root.querySelector("[data-reveal-image]");
      if (block && image) {
        // Red bar sweeps across the photo and back, uncovering the image as it
        // retreats. Overlapped with the line draw so the whole panel feels live.
        tl.fromTo(
          block,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.6, ease: "power3.inOut" },
          "-=1.0"
        );
        tl.to(block, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.7,
          ease: "power3.inOut",
        });
        tl.fromTo(image, { opacity: 0 }, { opacity: 1, duration: 0.1 }, "-=0.6");
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
