"use client";

import { useEffect, useRef } from "react";
import styles from "./RolunkCulture.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// A kultúra szekció a Rólunk oldal magja — itt a hangsúly a LineiQ
// gondolkodásmódján, nem az alapítók életrajzán. A body szövegek egyelőre
// lorem ipsum helykitöltők, a végleges hangot Kristóf és Áron adja meg.
const PRINCIPLES = [
  {
    num: "01",
    title: "Mélymunka, nem zaj",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua nostrud.",
  },
  {
    num: "02",
    title: "Rendszer, nem kampány",
    body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.",
  },
  {
    num: "03",
    title: "Ízlés, nem sablon",
    body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum sed perspiciatis.",
  },
];

export default function RolunkCulture() {
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
          scrollTrigger: { trigger: root, start: "top 70%" },
        }
      );

      const line = root.querySelector<SVGPathElement>("[data-narrative-line]");
      if (line) {
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 65%" },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`section section--dark ${styles.culture}`}
      id="kultura"
    >
      <div className="container">
        <header className={styles.head}>
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
          <h2 className={`text-statement ${styles.heading}`} data-reveal>
            A kultúra nem dísz.
            <br />
            Az a termék.
          </h2>
          <p className={styles.lead} data-reveal>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </header>

        <ul className={styles.principles}>
          {PRINCIPLES.map((p) => (
            <li key={p.num} className={styles.principle} data-reveal>
              <span className={styles.num}>{p.num}</span>
              <h3 className={styles.principleTitle}>{p.title}</h3>
              <p className={styles.principleBody}>{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
