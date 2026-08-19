"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutRefusals.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// The three Refusals and the one Limitation (World.md §3). Refusal positioning
// is a named differentiator, so it gets a section rather than a footnote. The
// Limitation is deliberately the most exposed copy on the site: saying the
// weakness out loud, with the receipts that offset it, is the "radical honesty
// in plain view" principle from Principles.md §12.
const REFUSALS = [
  "We refuse to sell leads, even when a prospect asks for them and would pay.",
  "We refuse to take a client we would not want to know for a decade, even when runway is thin.",
  "We refuse to publish work we would be embarrassed to show in three years.",
];

interface Props {
  /** Pre-rendered on the server from the two birth dates, never hardcoded. */
  ageSentence: string;
}

export default function AboutRefusals({ ageSentence }: Props) {
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
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root, start: "top 72%" },
        }
      );

      // Each refusal gets its own red tick wiping in from the left as it lands.
      root.querySelectorAll<HTMLElement>("[data-refusal]").forEach((item) => {
        const tick = item.querySelector("[data-tick]");
        if (!tick) return;
        gsap.fromTo(
          tick,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 85%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`section section--dark ${styles.refusals}`}
      id="refusals"
    >
      <div className="container">
        <header className={styles.head}>
          <h2 className={`text-section ${styles.title}`} data-reveal>
            Refusal is a service.
          </h2>
          <p className={styles.lead} data-reveal>
            Saying no faster protects the work that is left, and protects the few
            who get in. Three of ours are not up for discussion.
          </p>
        </header>

        <ol className={styles.list}>
          {REFUSALS.map((refusal, i) => (
            <li key={i} className={styles.item} data-refusal data-reveal>
              <span className={styles.tick} data-tick aria-hidden="true" />
              <p className={styles.refusal}>{refusal}</p>
            </li>
          ))}
        </ol>

        <aside className={styles.limitation} data-reveal>
          <p className={styles.limitationLabel}>And one thing we will not dress up</p>
          <p className={styles.limitationBody}>
            {ageSentence} We have no client outcome receipts yet, and we do not
            hide it. We built the Academy, 22 original frameworks, and the Dream
            Outcome Process before taking a single client, because we refuse to
            charge a price we cannot run a procedure to justify. We will still be
            students in two years. The one thing we do, we do well.
          </p>
        </aside>
      </div>
    </section>
  );
}
