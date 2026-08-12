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
      // line and the red wipe — all scrubbed to scroll. The content is centred
      // in the 110vh panel, so during the approach it sits below the fold; the
      // range therefore starts late (top 60%) and ends as the composition
      // settles into the viewport (top 10% ≈ content centred). Earlier the end
      // sat at "top -20%", which parked ~20vh of extra scroll behind the final
      // frame and made the whole sequence — the red wipe especially — finish
      // long after the section was already in view. scrub: 1 smooths fast
      // flicks into a soft catch-up instead of a snap.
      // Durations below are relative weights of that range (total ≈ 2).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 60%",
          end: "top 10%",
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
      //    Lengthened durations spread the sweep over more scroll (slower), and
      //    sine.inOut gives a gentler in/out than power2 (smoother). The reveal
      //    starts earlier to win the extra room; the return still lands on the
      //    timeline end (~2.0) so the rest of the section is untouched.
      const block = root.querySelector("[data-red-block]");
      if (block) {
        tl.fromTo(
          block,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.8, ease: "sine.inOut" },
          0.6
        );
        tl.to(
          block,
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.7,
            ease: "sine.inOut",
          },
          1.3
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
                A Hungarian studio,{" "}
                {/* "by Western-European" is held as one unbreakable run. The
                    hyphen alone was the first bug (it split the compound); once
                    that was fixed the two-word remainder stranded "by" on a line
                    of its own at ~900px. The only break left in the clause is the
                    space before "standards." */}
                <span className={styles.highlight}>
                  <span className={styles.nobreak}>by Western-European</span>{" "}
                  standards.
                </span>
              </span>
              <span className={styles.line2} data-lead-line>
                Everyone uses AI. The difference is the{" "}
                <span className={styles.highlight}>mind</span> and the{" "}
                <span className={styles.highlight}>taste.</span>
              </span>
              {/* A záró tömb EGY animált egység, nem két külön sor. Telefonon a
                  két mondat egyetlen szövegfolyamban tördelődik (lásd
                  Manifesto.module.css, .lastBlock text-wrap: balance), ott tehát
                  inline elem — inline elemre viszont nem hat a transform, így a
                  data-lead-line-nak a blokkon kell ülnie, különben a felemelkedés
                  mobilon némán elmarad, és csak a beúszás maradna. A piros sáv
                  amúgy is egy gesztusként fogja össze a két mondatot. */}
              <span className={styles.lastBlock} data-lead-line>
                <span className={styles.line3}>
                  Brand, content and code from creative minds,
                </span>{" "}
                <span className={styles.line4}>
                  with technical and theoretical{" "}
                  <span className={styles.highlight}>expertise.</span>
                </span>
              </span>
            </p>
          </div>

          <div className={styles.imageWrap} data-reveal>
            <div className={styles.imageBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/work/studio.jpg"
                alt="LineiQ studio"
                className={styles.image}
                data-reveal-image
              />
              <span className={styles.redBlock} data-red-block />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
