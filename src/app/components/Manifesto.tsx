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
      // Here we only animate the Manifesto's own content as it arrives.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 70%" },
      });

      const line = root.querySelector<SVGPathElement>("[data-narrative-line]");
      if (line) {
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
        tl.to(line, { strokeDashoffset: 0, duration: 2, ease: "power3.out" }, 0.2);
      }

      const block = root.querySelector("[data-red-block]");
      const image = root.querySelector("[data-reveal-image]");
      if (block && image) {
        // Red bar sweeps across the photo and back, uncovering the image.
        tl.set(image, { opacity: 1 }, 0);
        tl.fromTo(
          block,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.6, ease: "power3.inOut" },
          0.3
        );
        tl.to(block, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.7,
          ease: "power3.inOut",
        });
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
