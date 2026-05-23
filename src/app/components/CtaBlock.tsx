"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CtaBlock.module.css";
import SplashLink from "./SplashLink";

export default function CtaBlock() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

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
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={`section ${styles.cta}`} id="cta">
      <div className="container">
        <div className={styles.inner}>
          <p className="text-label" data-reveal>
            ◆ 05 — Beszéljünk
          </p>

          <h2 className={`text-hero ${styles.headline}`} data-reveal>
            Építsünk valami
            <br />
            <em className={styles.italic}>hangosat.</em>
          </h2>

          <p className={styles.kranky} data-reveal>
            <span className="text-signature">say hi.</span>
          </p>

          <p className={styles.lede} data-reveal>
            Lépéses intake, nem generikus űrlap. A cégnévtől indulunk, a többi
            kérdés a projekted alakja szerint alakul.
          </p>

          <div className={styles.actions} data-reveal>
            <SplashLink
              href="/kapcsolat"
              className="btn-primary"
              cursorText="Beszéljünk"
              splashColor="var(--color-green)"
            >
              <span className="btn-label">Projektet indítok</span>
            </SplashLink>
            <SplashLink
              href="mailto:hello@lineiq.hu"
              className="btn-secondary"
              cursorText="Email"
            >
              <span className="btn-label">hello@lineiq.hu</span>
            </SplashLink>
          </div>

          <div className={styles.meta} data-reveal>
            <div>
              <p className="text-label">Stúdió</p>
              <p className={styles.metaText}>
                Budapest, HU
                <br />
                globálisan dolgozunk
              </p>
            </div>
            <div>
              <p className="text-label">Időzítés</p>
              <p className={styles.metaText}>
                2026 Q3-tól
                <br />
                retainer alapú
              </p>
            </div>
            <div>
              <p className="text-label">Válaszidő</p>
              <p className={styles.metaText}>
                2 munkanapon belül
                <br />
                emberi válasz
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
