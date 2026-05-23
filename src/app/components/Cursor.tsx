"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./Cursor.module.css";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) {
      document.documentElement.classList.add("no-cursor");
      return;
    }

    const dot = dotRef.current;
    if (!dot) return;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.45, ease: "power3.out" });

    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0 });
    let revealed = false;

    const onMove = (e: MouseEvent) => {
      if (!revealed) {
        revealed = true;
        gsap.to(dot, { opacity: 1, duration: 0.25 });
      }
      xTo(e.clientX);
      yTo(e.clientY);

      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      dot.classList.toggle(styles.onDark, !!el?.closest(".section--dark, [data-dark]"));
    };

    const hoverables = document.querySelectorAll<HTMLElement>("a, button, [data-cursor-hover]");
    const onEnter = () => dot.classList.add(styles.hover);
    const onLeave = () => dot.classList.remove(styles.hover);
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return <div ref={dotRef} className={styles.cursor} aria-hidden="true" />;
}
