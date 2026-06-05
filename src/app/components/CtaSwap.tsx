"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./CtaSwap.module.css";

interface CtaSwapProps {
  defaultLabel: string;
  hoverLabel: string;
  className?: string;
}

/**
 * Highlight-swap label. On hover/focus a black box strikes across the default
 * word with the style guide's in-out curve, and the hover word surfaces letter
 * by letter on top of it, overlapping the sweep so the two read as one motion.
 * Drop it inside any focusable host (anchor or button) — it binds to the
 * closest one for keyboard support and fills the host's hit area.
 */
export default function CtaSwap({
  defaultLabel,
  hoverLabel,
  className,
}: CtaSwapProps) {
  const swapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const swap = swapRef.current;
    if (!swap || typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const letters = Array.from(swap.getElementsByClassName(styles.letter));
    const host = swap.closest("a, button") ?? swap;

    const enter = () => {
      swap.dataset.active = "true";
      gsap.killTweensOf(letters);
      if (reduce) {
        gsap.set(letters, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        letters,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          // Same curve as the highlight box (--ease-in-out ≈ power3.inOut),
          // offset by the delay so it trails the sweep slightly.
          ease: "power3.inOut",
          delay: 0.12,
        }
      );
    };
    const leave = () => {
      delete swap.dataset.active;
      gsap.killTweensOf(letters);
      if (reduce) {
        gsap.set(letters, { opacity: 0 });
        return;
      }
      gsap.to(letters, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
    };

    host.addEventListener("mouseenter", enter);
    host.addEventListener("mouseleave", leave);
    host.addEventListener("focus", enter);
    host.addEventListener("blur", leave);
    return () => {
      host.removeEventListener("mouseenter", enter);
      host.removeEventListener("mouseleave", leave);
      host.removeEventListener("focus", enter);
      host.removeEventListener("blur", leave);
      gsap.killTweensOf(letters);
    };
  }, []);

  return (
    <span
      className={`${styles.swap}${className ? ` ${className}` : ""}`}
      ref={swapRef}
    >
      <span className={styles.box} aria-hidden="true" />
      <span className={styles.default}>{defaultLabel}</span>
      <span className={styles.hover} aria-hidden="true">
        {hoverLabel.split("").map((ch, i) => (
          <span key={i} className={styles.letter}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  );
}
