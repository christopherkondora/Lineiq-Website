"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./Partners.module.css";

// A WeAre után: az ashleybrookecs.com "most of our client work comes from
// trusted Referrals" szekciójának újraalkotása LineiQ nyelven. Óriás Wix Madefor
// verzál fejléc, jobb alsó sarkában egy piros Kranky script-szó, alatta két
// hasáb folyószöveg. Az animáció a példaoldal receptje, scroll-synced (scrub):
// a fejléc SZAVAI sor-maszk alól emelkednek (yPercent 110), a script-szó balról
// jobbra "rajzolódik be" (clip-path wipe — a referencia DrawSVG kézírásának
// font-megfelelője), a hasábok sorai pedig szintén maszk alól úsznak fel.
export default function Partners() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const root = rootRef.current;
    if (!root) return;

    const heading = root.querySelector<HTMLElement>("[data-heading]");
    const script = root.querySelector<HTMLElement>("[data-script]");
    const cols = gsap.utils.toArray<HTMLElement>("[data-col]", root);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // statikusan a helyén marad

    const mm = gsap.matchMedia();
    const splits: SplitText[] = [];

    mm.add("(min-width: 768px)", () => {
      // Ashley-féle kétütem, scroll-synced (scrub): (1) a fekete Fraunces verzál
      // szöveg oldalról (jobbról) a helyére csúszik, majd (2) a piros Kranky
      // script-szó balról jobbra "beíródik" egy clip-path wipe-pal.
      if (heading) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heading,
            start: "top 82%",
            end: "top 30%",
            scrub: 1,
          },
        });
        tl.from(heading, { xPercent: 14, ease: "none", duration: 1 });
        if (script) {
          tl.from(
            script,
            {
              clipPath: "inset(-25% 100% -25% 0%)",
              ease: "none",
              duration: 1,
            },
            0.55
          );
        }
      }

      // Hasábok: minden oszlop sorai külön maszk alól emelkednek, a hasábok
      // nézetbe érésére húzva (scrub), enyhén késleltetve egymáshoz képest.
      cols.forEach((col) => {
        SplitText.create(col, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: styles.line,
          onSplit(self) {
            splits.push(self);
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: col,
                start: "top 88%",
                end: "top 50%",
                scrub: 1,
              },
            });
            tl.from(self.lines, {
              yPercent: 110,
              ease: "none",
              stagger: { each: 0.12 },
            });
            return tl;
          },
        });
      });

      return () => splits.forEach((s) => s.revert());
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.partners} id="partnerek">
      <div className={`container ${styles.inner}`}>
        <div className={styles.headingWrap}>
          <h2 className={styles.heading} data-heading>
            WE DON&apos;T
            <br />
            TAKE ON
            <br />
            CLIENTS. WE
            <br />
            TAKE ON
          </h2>
          <span className={styles.script} data-script aria-hidden="true">
            partners
          </span>
        </div>

        <div className={styles.paras}>
          <div className={styles.col} data-col>
            <p>
              That&apos;s the difference: a studio you keep, not a vendor you
              replace. Built on trust, consistency, and a point of view.
            </p>
            <p>
              Curious, transparent, ambitious — and a little obsessed with the
              details most people never notice.
            </p>
          </div>
          <div className={styles.col} data-col>
            <p>
              Setup, a retainer, and a real relationship behind both. We pick up
              the phone, and we show up in person.
            </p>
            <p>
              Western-European craft, Hungarian roots. Do the work right, and the
              work sells itself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
