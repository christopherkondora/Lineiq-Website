"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Contact.module.css";
import SplashLink from "./SplashLink";

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
    <section ref={rootRef} className={`section ${styles.contact}`} id="contact">
      <div className="container">
        <div className={styles.inner}>
          <p className="text-label" data-reveal>
            ◆ 05 — Start a project
          </p>

          <h2 className={`text-hero ${styles.headline}`} data-reveal>
            Let&apos;s build
            <br />
            something <em className={styles.italic}>loud.</em>
          </h2>

          <p className={styles.kranky} data-reveal>
            <span className="text-signature">say hi.</span>
          </p>

          <div className={styles.actions} data-reveal>
            <SplashLink
              href="mailto:hello@lineiq.hu"
              className="btn-primary"
              cursorText="Send email"
              splashColor="var(--color-green)"
            >
              <span className="btn-label">hello@lineiq.hu</span>
            </SplashLink>
            <SplashLink
              href="#top"
              className="btn-secondary"
              cursorText="Back to top"
            >
              <span className="btn-label">Back to top ↑</span>
            </SplashLink>
          </div>

          <div className={styles.grid} data-reveal>
            <div>
              <p className="text-label">Studio</p>
              <p className={styles.gridText}>
                Budapest, HU
                <br />
                operating worldwide
              </p>
            </div>
            <div>
              <p className="text-label">Schedule</p>
              <p className={styles.gridText}>
                Q3 2026 onward
                <br />
                Retainer & project
              </p>
            </div>
            <div>
              <p className="text-label">Direct</p>
              <p className={styles.gridText}>
                hello@lineiq.hu
                <br />
                +36 30 000 0000
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
