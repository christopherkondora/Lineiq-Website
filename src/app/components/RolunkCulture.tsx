"use client";

import { useEffect, useRef } from "react";
import styles from "./RolunkCulture.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// A Rólunk második szekciója: tisztán szöveg, a piros narratív vonal a
// háttérben. A bekezdések szavanként világosodnak ki, a fény átlósan söpör
// végig a szövegen (bal-felülről jobb-alulra), a görgetéshez kötve.
const PARAGRAPHS = [
  "Founders shaping the world deserve a presence as strong as what they build. Most founders we work with create something significant, but their presence doesn't show it yet.",
];

export default function RolunkCulture() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const words = gsap.utils.toArray<HTMLElement>("[data-word]", root);
    const line = root.querySelector<SVGPathElement>("[data-line]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Reduced motion: a teljes szöveg azonnal világos, a vonal kirajzolva.
      gsap.set(words, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Minden szó átlós pozíciója (bal + felső táv a szekció sarkától)
      // adja a wave sorrendjét — ez söpör végig a görgetés alatt.
      const rootRect = root.getBoundingClientRect();
      const metrics = words.map((w) => {
        const r = w.getBoundingClientRect();
        return {
          w,
          diag: r.left - rootRect.left + (r.top - rootRect.top),
        };
      });
      const diags = metrics.map((m) => m.diag);
      const min = Math.min(...diags);
      const span = Math.max(...diags) - min || 1;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          // A wave akkor fejeződjön be, amikor a szöveg középre ér (még jól
          // látható), ne csak a szekció kigörgetésekor — ezért gyorsabb ablak.
          start: "top 82%",
          end: "center 35%",
          scrub: 0.6,
        },
      });

      // BAND: a görgetés mekkora hányadán át vált egy szó sötétből világosba.
      // A szavak az átlós pozíciójuk arányában lépnek be, így átlós sávban
      // söpör végig a fény.
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

      // Háttér piros vonal: a szekció belépésekor gyorsan, balról jobbra
      // rajzolódik át teljesen — rövid ablak, hogy olvasáskor már mindig teljes
      // szélességű legyen (a vonal mindkét szélen túlfut a viewporton).
      if (line) {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 92%",
            end: "top 58%",
            scrub: 0.4,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`section section--dark ${styles.culture}`}
      id="culture"
    >
      <svg
        className={styles.line}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0 100 Q 360 60, 720 100 T 1440 100"
          stroke="var(--color-red)"
          strokeWidth="1.2"
          fill="none"
          data-line
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
