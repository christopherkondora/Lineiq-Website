"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Services.module.css";

const services = [
  {
    n: "01",
    title: "Brand systems",
    body: "Visual identity, naming, voice and the rituals that make a brand feel inevitable. We design the whole, not the parts.",
    tags: ["Identity", "Naming", "Voice"],
  },
  {
    n: "02",
    title: "Web & interface",
    body: "Bespoke, animated, Awwwards-grade websites. Built on Next.js, scored with GSAP, breathing with Lenis.",
    tags: ["Next.js", "GSAP", "Lenis"],
  },
  {
    n: "03",
    title: "Custom software",
    body: "Internal tools, integrations, and full SaaS products. We ship Klient — and we build yours from the same DNA.",
    tags: ["SaaS", "TypeScript", "DX"],
  },
  {
    n: "04",
    title: "Content & film",
    body: "Photo, motion, and editorial that survive outside the brief. Same standard the agencies-of-record charge triple for.",
    tags: ["Photo", "Motion", "Editorial"],
  },
  {
    n: "05",
    title: "Marketing",
    body: "Strategy and execution under one roof. Paid, organic, and the unfair advantages most agencies pretend don't exist.",
    tags: ["Strategy", "Paid", "Organic"],
  },
];

export default function Services() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Section title reveal
      gsap.fromTo(
        root.querySelectorAll("[data-reveal]"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
          },
        }
      );

      // Row stagger reveal
      root.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
        gsap.fromTo(
          row,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 85%",
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={`section ${styles.services}`} id="services">
      <div className="container">
        <header className={styles.head}>
          <p className="text-label" data-reveal>
            ◆ 02 — What we do
          </p>
          <h2 className={`text-section ${styles.title}`} data-reveal>
            One studio. Five disciplines.
            <br />
            <span className={styles.titleAccent}>Zero handoffs.</span>
          </h2>
        </header>

        <ul className={styles.list}>
          {services.map((s) => (
            <li key={s.n} className={styles.row} data-row>
              <span className={styles.num}>{s.n}</span>
              <div className={styles.body}>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <p className={styles.copy}>{s.body}</p>
              </div>
              <ul className={styles.tags}>
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <span className={styles.arrow}>↗</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
