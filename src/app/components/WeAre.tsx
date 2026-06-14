"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import styles from "./WeAre.module.css";

// Beszédes interstitial a Work és a Partners között (ashleybrookecs.com "we are
// multilingual" recept, LineiQ nyelven): négysoros Fraunces identitás-állítás
// (normál szedés) a bal alsó sarokba rendezve. A karakterek yPercent -110-ből
// (felülről) csúsznak a helyükre sor-maszk alól, scroll-synced (scrub), középről
// kifelé staggerrel, a fejléc saját nézetbe érésére húzva. Végigfut egy piros
// vonal-flourish, ami görgetésre rajzolódik be (DrawSVG): a képernyő bal széléről
// indul, egyet loopol, majd a jobb felső sarok közelében elhagyja a képernyőt.
// A vonalvastagság a Hero ambient-vonalával egyezik (1440-es viewBox, 1.2 stroke).
export default function WeAre() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

    const root = rootRef.current;
    if (!root) return;

    const heading = root.querySelector<HTMLElement>("[data-statement]");
    const line = root.querySelector<SVGPathElement>("[data-line]");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // statikusan a helyén marad, a vonal végállapotban látszik

    // A vonal görgetésre rajzolódik be, a path elejéről (bal szél) a végéig
    // (jobb felső sarok). Minden méreten fut, dekoratív.
    let lineTween: gsap.core.Tween | null = null;
    if (line) {
      gsap.set(line, { drawSVG: "0%" });
      lineTween = gsap.to(line, {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: root,
          // Hosszabb tartomány → lassabb rajz (~1.25 viewport-magasság).
          start: "top 80%",
          end: "bottom 55%",
          scrub: 1,
        },
      });
    }

    // A magállítás karakter-reveal-je csak asztali nézetben (>=768px) fut;
    // mobilon/reduced motion mellett az állítás statikusan marad.
    const mm = gsap.matchMedia();
    if (heading) {
      mm.add("(min-width: 768px)", () => {
        const split = SplitText.create(heading, {
          type: "lines, chars",
          autoSplit: true,
          linesClass: styles.line,
          charsClass: styles.char,
          onSplit(self) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: heading,
                // Korábban induljon és gyorsabban érjen végig (a szöveg ne később
                // jelenjen meg): amint a fejléc alulról beúszik, már épül.
                start: "top 95%",
                end: "top 58%",
                scrub: 1,
              },
            });
            tl.from(self.chars, {
              yPercent: -110,
              ease: "none",
              stagger: { each: 0.05, from: "center" },
            });
            return tl;
          },
        });
        return () => split.revert();
      });
    }

    return () => {
      mm.revert();
      if (lineTween) {
        lineTween.scrollTrigger?.kill();
        lineTween.kill();
      }
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.weare} id="kik-vagyunk">
      <svg
        className={styles.lineSvg}
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Egyetlen folytonos, törésmentes vonal. A path egy Catmull-Rom spline-ból
            generált (minden ponton automatikusan SIMA, C1-folytonos érintő → nincs
            sarok). A bal-középső szakasz egy nagy, kerek, önmagát keresztező hurok,
            utána a vonal simán jobbra-fel sodródik és a jobb felső sarkon elhagyja
            a képernyőt. Egy path → a DrawSVG végig egyben rajzolja. */}
        <path
          data-line
          d="M-80 540 C-23.3 540.0 168.3 551.7 260 540 C351.7 528.3 420.0 510.0 470 470 C520.0 430.0 571.7 346.7 560 300 C548.3 253.3 455.0 191.7 400 190 C345.0 188.3 255.0 243.3 230 290 C205.0 336.7 216.7 428.3 250 470 C283.3 511.7 365.0 535.0 430 540 C495.0 545.0 548.3 526.7 640 500 C731.7 473.3 873.3 433.3 980 380 C1086.7 326.7 1193.3 253.3 1280 180 C1366.7 106.7 1463.3 -20.0 1500 -60"
          stroke="var(--color-red)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className={`container ${styles.inner}`}>
        <h2 className={styles.statement} data-statement>
          We are Hungarian,
          <br />
          we think globally.
        </h2>
      </div>
    </section>
  );
}
