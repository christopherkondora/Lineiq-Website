"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Intro.module.css";

export default function Intro() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-reveal]"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 70%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.intro} id="intro">
      <div className="container">
        <div className={styles.composition}>
          <p className={styles.lead} data-reveal>
            <span className={styles.firstLine}>
              Egy brandépítő stúdió{" "}
              <span className={`${styles.highlight} ${styles.strike}`}>
                Ügynökség
              </span>{" "}
              és szoftverház.
            </span>
            <span className={styles.secondLine}>
              <span className={styles.highlight}>Nem csak</span> kivitelezünk, nem
              különálló szolgáltatásokat nyújtunk.
            </span>
            <span className={styles.thirdLine}>
              Nevet építünk, amit egyedi szoftveres megoldásokkal és marketing
              rendszerrel
            </span>
            <span className={styles.fourthLine}>
              <span className={styles.support}>támogatunk meg.</span>{" "}
              <span className={styles.ecosystem}>
                Egy <span className={styles.highlight}>ökoszisztéma,</span>{" "}
                aminek egyetlen célja van:
              </span>
            </span>
          </p>

          <p className={styles.closing} data-reveal>
            Hogy bemutatkozhass a világnak.
          </p>
        </div>
      </div>
    </section>
  );
}
