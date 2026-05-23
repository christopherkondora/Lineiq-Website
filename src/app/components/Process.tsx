"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Process.module.css";
import SplashLink from "./SplashLink";

const phases = [
  {
    n: "01",
    duration: "Egyszer · 6—10 hét",
    title: "Setup fázis",
    sub: "foundation.",
    body:
      "A brand alapjai a helyükre kerülnek. Pozicionálás, vizuális identitás, weboldal, narratíva. Egy kéz, egy throughline, nincs handoff a brand és a kód között.",
    deliverables: [
      "Brand stratégia és pozicionálás",
      "Vizuális identitás és design rendszer",
      "Awwwards-szintű weboldal",
      "Indító kommunikációs anyagok",
    ],
  },
  {
    n: "02",
    duration: "Havonta · min. 6 hónap",
    title: "Retainer fázis",
    sub: "compounding.",
    body:
      "A setup nem önmagában áll. A retainer alatt a brand él, hat és növekszik. Tartalom, kampány, optimalizáció, állandó kreatív partner egyetlen havi díjjal.",
    deliverables: [
      "Folyamatos kreatív és kampány output",
      "Fizetett és organikus hirdetések",
      "Havi riport és stratégiai felülvizsgálat",
      "Klient portál hozzáférés",
    ],
  },
];

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-reveal]"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );

      root.querySelectorAll<HTMLElement>("[data-phase]").forEach((phase) => {
        gsap.fromTo(
          phase,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: phase, start: "top 80%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={`section ${styles.process}`} id="folyamat">
      <div className="container">
        <header className={styles.head}>
          <p className="text-label" data-reveal>
            ◆ 03 — Hogyan dolgozunk
          </p>
          <h2 className={`text-section ${styles.title}`} data-reveal>
            Két fázis,
            <br />
            <em className={styles.italic}>egy folyamat.</em>
          </h2>
        </header>

        <div className={styles.phases}>
          {phases.map((p) => (
            <article key={p.n} className={styles.phase} data-phase>
              <header className={styles.phaseHead}>
                <span className={styles.phaseNum}>{p.n}</span>
                <span className={styles.phaseDuration}>{p.duration}</span>
              </header>

              <h3 className={styles.phaseTitle}>{p.title}</h3>
              <p className={styles.phaseSub}>{p.sub}</p>
              <p className={styles.phaseBody}>{p.body}</p>

              <ul className={styles.deliverables}>
                {p.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className={styles.cta} data-reveal>
          <SplashLink
            href="/mit-nyujtunk"
            className="btn-secondary"
            cursorText="Részletes folyamat"
          >
            <span className="btn-label">Részletes folyamat ↗</span>
          </SplashLink>
        </div>
      </div>
    </section>
  );
}
