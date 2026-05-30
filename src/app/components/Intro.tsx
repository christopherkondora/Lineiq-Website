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
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.intro} id="intro">
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.label}>
            <p className="text-label" data-reveal>
              ◆ 01 — Kik vagyunk
            </p>
            <div className={styles.line} data-reveal />
          </div>

          <div className={styles.body}>
            <h2 className={styles.statement} data-reveal>
              Prémium brandépítő ügynökség és szoftverház, magyar piacra,{" "}
              <em>nyugat-európai mércével.</em>
            </h2>

            <p className={styles.copy} data-reveal>
              Egyetlen csomag, hat hónapos retainer minimum, egy kreatív kézből
              brand, kód és tartalom. Nincs handoff, nincs ügynökségi színház,
              nincs újrahasznosított deck.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
