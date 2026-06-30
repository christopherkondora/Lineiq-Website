"use client";

import { useEffect, useRef } from "react";
import SplashLink from "./SplashLink";
import CtaSwap from "./CtaSwap";
import styles from "./RolunkClose.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function RolunkClose() {
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
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={`section section--dark ${styles.close}`}>
      <div className={`container ${styles.inner}`}>
        <h2 className={`text-statement ${styles.heading}`} data-reveal>
          If this resonates,
          <br />
          let&apos;s talk.
        </h2>
        <div className={styles.actions} data-reveal>
          <SplashLink href="/contact" className={styles.ctaLink}>
            <CtaSwap defaultLabel="Let's begin." hoverLabel="Let's go!" />
          </SplashLink>
        </div>
      </div>
    </section>
  );
}
