"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Manifesto.module.css";

export default function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-reveal]"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );

      const line = root.querySelector<SVGPathElement>("[data-narrative-line]");
      if (line) {
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: line, start: "top 80%" },
        });
      }

      const block = root.querySelector("[data-red-block]");
      const image = root.querySelector("[data-reveal-image]");
      if (block && image) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: block.parentElement, start: "top 70%" },
        });
        tl.fromTo(
          block,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.6, ease: "power3.inOut" }
        );
        tl.to(block, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.7,
          ease: "power3.inOut",
        });
        tl.fromTo(image, { opacity: 0 }, { opacity: 1, duration: 0.1 }, "-=0.6");
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`section section--dark ${styles.manifesto}`}
      id="manifesto"
    >
      <svg
        className={styles.narrativeLine}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0 100 Q 360 20, 720 100 T 1440 100"
          stroke="var(--color-red)"
          strokeWidth="2"
          fill="none"
          data-narrative-line
        />
      </svg>

      <div className="container">
        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className="text-label" data-reveal>
              ◆ 04 — Manifesto
            </p>

            <h2 className={`text-statement ${styles.heading}`} data-reveal>
              The algorithm got cheap.
              <br />
              <em className={styles.italic}>Taste didn&apos;t.</em>
            </h2>

            <p className={styles.kranky} data-reveal>
              <span className="text-signature">human touch.</span>
            </p>

            <div className={styles.body}>
              <p data-reveal>
                Magyar stúdió, nyugat-európai mércével. Brand, kód, tartalom egy
                kéz alatt, egy kreatív throughline-nal. Nincs handoff, nincs
                ügynökségi színház, nincs újrahasznosított deck.
              </p>
              <p data-reveal>
                Ami 2026-ban megkülönböztet, az nem egy gyorsabb GPU. Az a rész,
                amit az algoritmus nem tud lemásolni: egy valódi telefonhívás a
                születésnapodon, egy palack bor, ami valamit jelent, és egy
                partner, aki tényleg felveszi.
              </p>
            </div>
          </div>

          <div className={styles.imageWrap} data-reveal>
            <div className={styles.imageBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/work/studio.jpg"
                alt="LineiQ stúdió"
                className={styles.image}
                data-reveal-image
              />
              <span className={styles.redBlock} data-red-block />
            </div>
            <p className={styles.caption}>
              <span className="text-label">Stúdió · BP</span>
            </p>
          </div>
        </div>

        <div className={styles.principles}>
          {[
            {
              n: "01",
              title: "Egy kéz",
              body: "Brand, kód és tartalom ugyanabból a kreatív kézből.",
            },
            {
              n: "02",
              title: "Tegyük elkerülhetetlenné",
              body: "A döntések hónapokkal később is magától értetődőnek hatnak.",
            },
            {
              n: "03",
              title: "Először az ember",
              body: "Bor, nem workflow. Telefon, nem ticket.",
            },
          ].map((p) => (
            <div key={p.n} className={styles.principle} data-reveal>
              <span className={styles.principleNum}>{p.n}</span>
              <h3 className={styles.principleTitle}>{p.title}</h3>
              <p className={styles.principleBody}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
