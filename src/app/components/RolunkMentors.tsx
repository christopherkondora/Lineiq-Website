"use client";

import { useEffect, useRef } from "react";
import styles from "./RolunkMentors.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// "Akikre felnézünk" — külön szekció emberekről, nem a könyvespolc. Egy
// mondat arról, mit jelent az adott személy a LineiQ munkájában. Dalio és Suby
// megerősítve, a lista bővül; a placeholder kártya ezt jelzi.
const MENTORS = [
  {
    initials: "RD",
    name: "Ray Dalio",
    line: "He lives on in the company's systems and culture — principles must be written down and applied consistently.",
  },
  {
    initials: "SS",
    name: "Sabri Suby",
    line: "The backbone of our marketing mindset — earning attention, not buying it.",
  },
  {
    initials: "—",
    name: "Soon",
    line: "The roster is still forming. A name earns its place here only after the thinking behind it has changed how we actually work.",
    placeholder: true,
  },
];

export default function RolunkMentors() {
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
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root, start: "top 72%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={`section ${styles.mentors}`} id="mentors">
      <div className="container">
        <header className={styles.head}>
          <h2 className={`text-section ${styles.title}`} data-reveal>
            Those who came before us.
          </h2>
          <p className={styles.lead} data-reveal>
            Not a biography and not a wall of quotes. One sentence on what each
            thinker means to LineiQ&apos;s work.
          </p>
        </header>

        <ul className={styles.grid}>
          {MENTORS.map((m) => (
            <li
              key={m.name}
              className={`${styles.card} ${m.placeholder ? styles.cardPlaceholder : ""}`}
              data-reveal
            >
              <div className={styles.photo} aria-hidden="true">
                <span className={styles.initials}>{m.initials}</span>
              </div>
              <h3 className={styles.name}>{m.name}</h3>
              <p className={styles.line}>{m.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
