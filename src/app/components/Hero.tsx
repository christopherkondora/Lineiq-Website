"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import SplashLink from "./SplashLink";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(
        root.querySelectorAll("[data-hero-reveal]"),
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      const line = root.querySelector("[data-hero-line]");
      if (line) {
        gsap.to(line, {
          yPercent: -25,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const ghostWrap = root.querySelector("[data-hero-ghost]");
      if (ghostWrap) {
        gsap.to(ghostWrap, {
          y: () => window.innerHeight * 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }

      const strike = root.querySelector<SVGPathElement>("[data-hero-strike]");
      if (strike) {
        const length = strike.getTotalLength();
        gsap.set(strike, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(strike, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "30% top",
            scrub: true,
          },
        });
      }

      const blob = root.querySelector("[data-hero-blob]");
      if (blob) {
        gsap.to(blob, {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.hero} id="top">
      <svg
        className={styles.blob}
        data-hero-blob
        viewBox="0 0 900 720"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path
          className={styles.blobShape}
          d="M 60 40 C 180 -20 340 -30 470 20 C 580 50 700 -10 820 30 C 920 60 900 220 880 340 C 860 460 830 580 720 640 C 600 700 430 690 300 650 C 180 610 60 670 -10 580 C -70 490 -30 360 10 260 C 40 170 -30 110 60 40 Z"
        />
      </svg>

      <div className={styles.ghostWrap} data-hero-ghost aria-hidden="true">
        <svg
          className={styles.ghostSvg}
          viewBox="0 0 480 160"
          preserveAspectRatio="xMidYMid meet"
        >
          <text x="0" y="118" className={styles.ghostText}>
            átlagos
          </text>
          <path
            data-hero-strike
            className={styles.ghostStrike}
            d="M 4 96 Q 100 82 200 90 T 380 86 T 476 92"
            fill="none"
          />
        </svg>
      </div>

      <svg
        className={styles.ambientLine}
        data-hero-line
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M -50 600 Q 200 500, 400 580 T 800 540 T 1200 600 T 1500 520"
          stroke="var(--color-red)"
          strokeWidth="1.2"
          fill="none"
          className={styles.ambientPath}
        />
        <path
          d="M -50 650 Q 250 580, 450 640 T 850 600 T 1250 660 T 1500 580"
          stroke="var(--color-red)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
          className={styles.ambientPath2}
        />
      </svg>

      <div className={`container ${styles.inner}`}>
        <p className="text-label" data-hero-reveal>
          ◆ Brand · Kód · Jel
        </p>

        <h1 className={`text-hero ${styles.title}`} data-hero-reveal>
          Forget being
          <br />
          <span className={styles.ordinaryWrap}>
            ordinary<span className={styles.dot}>.</span>
          </span>
        </h1>

        <p className={styles.signature} data-hero-reveal>
          <span className="text-signature">noise off.</span>
        </p>

        <div className={styles.actions} data-hero-reveal>
          <SplashLink
            href="/kapcsolat"
            className="btn-primary"
            cursorText="Beszéljünk"
            splashColor="var(--color-red)"
          >
            <span className="btn-label">Projektet indítok</span>
          </SplashLink>
          <SplashLink
            href="/munkaink"
            className="btn-secondary"
            cursorText="Munkáink"
          >
            <span className="btn-label">Munkáink</span>
          </SplashLink>
        </div>

        <div className={styles.meta} data-hero-reveal>
          <div>
            <span className="text-label">Stúdió</span>
            <p className={styles.metaText}>Budapest · globálisan dolgozunk</p>
          </div>
          <div>
            <span className="text-label">Indulás</span>
            <p className={styles.metaText}>2026 Q3-tól</p>
          </div>
          <div>
            <span className="text-label">Fókusz</span>
            <p className={styles.metaText}>Brand · web · SaaS</p>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint} data-hero-reveal aria-hidden="true">
        <span className="text-label">Görgess</span>
        <span className={styles.scrollBar} />
      </div>
    </section>
  );
}
