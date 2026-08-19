"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutMentors.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// People, not the bookshelf. The two are deliberately different sets: the shelf
// is what we read, this is whose thinking changed how the studio actually runs.
// Sourced from World.md §4 (mentors LineiQ publicly respects) and the glossary,
// where each of these names is already load-bearing on a method we use daily.
// Portraits do not exist yet; `photo` is the drop-in slot, initials until then.
interface Mentor {
  initials: string;
  name: string;
  line: string;
  photo?: string;
}

const MENTORS: Mentor[] = [
  {
    initials: "DP",
    name: "Daniel Priestley",
    line: "Every engagement starts from his Magic Question: who has the most to gain from the hardest problem we know how to solve.",
  },
  {
    initials: "SS",
    name: "Sabri Suby",
    line: "The discipline of building from the customer's own words instead of ours. Five of the terms in our internal glossary trace back to him.",
  },
  {
    initials: "HD",
    name: "Harry Dry",
    line: "Every claim we publish has to survive his test. Can you picture it, can you falsify it, and could nobody else say it.",
  },
  {
    initials: "ND",
    name: "Neel Dhingra",
    line: "The Ism. One belief you stake the whole brand on, and everything downstream follows from it.",
  },
  {
    initials: "BM",
    name: "Bertalan Meskó",
    line: "A category of one, built in Hungary and read worldwide. Proof that where you are from is provenance, not a ceiling.",
  },
];

export default function AboutMentors() {
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
          scrollTrigger: { trigger: root, start: "top 72%" },
        }
      );

      // The cards run past the fold, so the grid reveals per row rather than in
      // one burst tied to the section top.
      gsap.fromTo(
        root.querySelectorAll("[data-card]"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: root.querySelector("[data-grid]") ?? root,
            start: "top 82%",
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={`section ${styles.mentors}`} id="mentors">
      <div className="container">
        <header className={styles.head}>
          <h2 className={`text-section ${styles.title}`} data-reveal>
            Those who came before us.
          </h2>
          <p className={styles.lead} data-reveal>
            Not a biography and not a wall of quotes. One sentence on what each of
            them changed in how we work. A name earns its place here only after
            the thinking behind it has changed something we actually do.
          </p>
        </header>

        <ul className={styles.grid} data-grid>
          {MENTORS.map((m) => (
            <li key={m.name} className={styles.card} data-card>
              <div className={styles.photo}>
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo}
                    alt={m.name}
                    className={styles.photoImage}
                    loading="lazy"
                  />
                ) : (
                  <span className={styles.initials} aria-hidden="true">
                    {m.initials}
                  </span>
                )}
              </div>
              <h3 className={styles.name}>{m.name}</h3>
              <p className={styles.line}>{m.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
