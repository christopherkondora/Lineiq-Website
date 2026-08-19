"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutFounders.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FOUNDERS } from "../data/founders";

// Scroll-synced founder introduction: the portrait animates in first, then the
// name rises to meet it, then the role and the line. Portraits do not exist
// yet, so the frame falls back to the initials treatment. Dropping a `photo`
// path into data/founders.ts is the only change needed when real shots land.
export default function AboutFounders() {
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
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );

      root.querySelectorAll<HTMLElement>("[data-founder]").forEach((block) => {
        const photo = block.querySelector("[data-photo]");
        const name = block.querySelector("[data-name]");
        if (!photo || !name) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 80%",
            end: "center 50%",
            scrub: 0.6,
          },
        });

        // 1) the portrait drifts up and resolves over the first ~60%
        tl.fromTo(
          photo,
          { yPercent: 14, scale: 0.9, autoAlpha: 0 },
          { yPercent: 0, scale: 1, autoAlpha: 1, ease: "none", duration: 0.6 }
        );
        // 2) only once it has landed does the name rise into place
        tl.fromTo(
          name,
          { yPercent: 70, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, ease: "none", duration: 0.4 },
          ">"
        );

        // The role and line are not scrubbed: text that scrubs backwards while
        // you read it is unpleasant, so they get a plain one-way reveal.
        const text = block.querySelector("[data-founder-text]");
        if (text) {
          gsap.fromTo(
            text,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "opacity,transform",
              scrollTrigger: { trigger: block, start: "top 55%" },
            }
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.founders} id="founders">
      <div className="container">
        <header className={styles.head}>
          <h2 className={`text-section ${styles.title}`} data-reveal>
            Two founders, one voice.
          </h2>
          <p className={styles.lead} data-reveal>
            LineiQ is the two of us for now, and we do not pretend otherwise. You
            will always know which one of us built the thing you are looking at.
          </p>
        </header>
      </div>

      <div className={styles.list}>
        {FOUNDERS.map((f) => (
          <div
            key={f.id}
            className={`${styles.founder} ${f.align === "left" ? styles.left : styles.right}`}
            data-founder
          >
            <div className={styles.inner}>
              <div className={styles.photo} data-photo>
                {f.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.photo}
                    alt={f.name}
                    className={styles.photoImage}
                    loading="lazy"
                  />
                ) : (
                  <span className={styles.initials} aria-hidden="true">
                    {f.initials}
                  </span>
                )}
              </div>
              <div className={styles.nameWrap}>
                <h3 className={styles.name} data-name>
                  {f.name}
                </h3>
              </div>
            </div>

            <div className={styles.text} data-founder-text>
              <p className={styles.role}>{f.role}</p>
              <p className={styles.line}>{f.line}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
