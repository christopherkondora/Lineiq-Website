"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutBeliefs.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// The seven convictions from Beliefs.md (locked v1, the world-facing layer).
// Headings are verbatim; the support lines are the doc's own text, trimmed. A
// prospect should be able to read this and know whether they belong here, which
// is the one job an About page has that no other page can do.
const BELIEFS = [
  {
    title: "Compounding wins.",
    body: "Everything we build is a bet that patience beats intensity, and that a slow asset outlasts a fast tactic. We test, we wait, and we abandon a thing only when the data is loud and the reason is concrete.",
  },
  {
    title: "We would rather own a small world than rent a big market.",
    body: "A loyal community of aligned people beats a large anonymous audience. We build a world people belong to, not a following we have to feed.",
  },
  {
    title: "We don't want to be rich. We want to be wealthy.",
    body: "The best partners, the best work, the highest-quality content, real value given. Wealthy socially, creatively, and financially. Not just a bigger number.",
  },
  {
    title: "Calm is the product.",
    body: "The market is noise. People come to us to step out of the everyday chaos, not to add to it. We are the calm island, on purpose.",
  },
  {
    title: "We compete with our last piece of work, not with anyone else.",
    body: "Comparison to others is a distraction. The only scoreboard that matters is whether this is better than the last thing we made.",
  },
  {
    title: "Win-win, or no deal.",
    body: "We only do things that are good for both sides. Anything else is a tax we refuse to pay or charge.",
  },
  {
    title: "Setbacks are tuition.",
    body: "When something breaks, we sit down, find out why, and learn. We do not panic. Life is the teacher and we pay attention.",
  },
];

export default function AboutBeliefs() {
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
          duration: 0.8,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );

      // Rows reveal individually rather than as one staggered burst: the list is
      // taller than the viewport, so a single trigger would play most of it
      // off-screen.
      root.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
        gsap.fromTo(
          row,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: { trigger: row, start: "top 88%" },
          }
        );

        const rule = row.querySelector("[data-row-rule]");
        if (rule) {
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: { trigger: row, start: "top 88%" },
            }
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={`section ${styles.beliefs}`} id="beliefs">
      <div className="container">
        <header className={styles.head}>
          <h2 className={`text-section ${styles.title}`} data-reveal>
            Seven convictions, and the work that follows from them.
          </h2>
          <p className={styles.lead} data-reveal>
            These are not slogans and they are not negotiable. Read them and you
            will know within a minute whether you belong in this world.
          </p>
        </header>

        <ol className={styles.list}>
          {BELIEFS.map((belief, i) => (
            <li key={belief.title} className={styles.row} data-row>
              <span className={styles.rowRule} data-row-rule aria-hidden="true" />
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.beliefTitle}>{belief.title}</h3>
              <p className={styles.beliefBody}>{belief.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
