"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./RolunkIntro.module.css";

export default function RolunkIntro() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-reveal]"),
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.1 }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.intro}>
      <div className="container">
        <h1 className={styles.title} data-reveal>
          What is Line<span className={styles.iq}>iQ</span>?
        </h1>
      </div>
    </section>
  );
}
