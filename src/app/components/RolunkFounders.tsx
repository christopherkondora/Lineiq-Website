"use client";

import { useEffect, useRef } from "react";
import styles from "./RolunkFounders.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Az alapítók scroll-synced bemutatása: ahogy a blokk a nézetbe görget,
// előbb a fotó animál be, majd a név. A nevek Fraunces-szal a fotóra lógnak.
const FOUNDERS = [
  { initials: "KK", name: "Kondora Kristóf", align: "left" as const },
  { initials: "SÁ", name: "Sütő Áron", align: "right" as const },
];

export default function RolunkFounders() {
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
          duration: 0.9,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );

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

        // 1) a fotó beúszik és kitisztul — a görgetés első ~60%-a
        tl.fromTo(
          photo,
          { yPercent: 14, scale: 0.9, autoAlpha: 0 },
          { yPercent: 0, scale: 1, autoAlpha: 1, ease: "none", duration: 0.6 }
        );
        // 2) a kép teljes landolása UTÁN emelkedik a név a helyére
        tl.fromTo(
          name,
          { yPercent: 70, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: "none", duration: 0.4 },
          ">"
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.founders} id="founders">
      <div className="container">
        <header className={styles.head}>
          <h2 className={`text-section ${styles.title}`} data-reveal>
            Two founders, one voice.
          </h2>
        </header>
      </div>

      <div className={styles.list}>
        {FOUNDERS.map((f) => (
          <div
            key={f.name}
            className={`${styles.founder} ${f.align === "left" ? styles.left : styles.right}`}
            data-founder
          >
            <div className={styles.inner}>
              <div className={styles.photo} data-photo aria-hidden="true">
                <span className={styles.initials}>{f.initials}</span>
              </div>
              <div className={styles.nameWrap}>
                <h3 className={styles.name} data-name>
                  {f.name}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
