"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Intro.module.css";

export default function Intro() {
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
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 70%" },
        }
      );

      // Scroll-synced redaction-swap a "Agency" szón, a CtaSwap gomb receptjével:
      // ELŐBB a piros highlight söpör végig balról jobbra (1. fázis, clip-path
      // 100%→0), AZTÁN — kissé késleltetve, a sweep után — a fehér "Studio" úszik
      // fel betűnként a piroson (2. fázis, betű-staggerelt opacity). A két fázist
      // egyetlen scrubbolt timeline pacingeli a görgetéssel. CSS base + a
      // reduced-motion media query a feltárt végállapotot tartja JS nélkül is.
      const redaction = root.querySelector<HTMLElement>("[data-redaction]");
      if (redaction) {
        const letters = redaction.querySelectorAll<HTMLElement>(
          "[data-studio-letter]"
        );
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: redaction,
            start: "top 55%",
            end: "top 20%",
            scrub: true,
          },
        });
        // 1. fázis — piros highlight wipe (a gomb .box scaleX-ének megfelelője)
        tl.fromTo(
          redaction,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut", duration: 1 },
          0
        );
        // 2. fázis — a "Studio" betűnként, a sweep BEFEJEZÉSE után indul (pos 1.0,
        // a box wipe vége), hogy tisztán "előbb highlight, aztán szöveg" legyen.
        tl.fromTo(
          letters,
          { opacity: 0 },
          { opacity: 1, ease: "power3.inOut", stagger: 0.16, duration: 0.6 },
          1.0
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.intro} id="intro">
      <div className="container">
        <div className={styles.composition}>
          <p className={styles.lead} data-reveal>
            <span className={styles.firstLine}>
              A brand-building{" "}
              <span className={styles.swap}>
                <span
                  className={`${styles.swapWord} ${styles.agency}`}
                  aria-hidden="true"
                >
                  Agency
                </span>
                <span className={styles.redaction} data-redaction>
                  <span className={`${styles.swapWord} ${styles.studio}`}>
                    {"Studio".split("").map((ch, i) => (
                      <span key={i} className={styles.studioLetter} data-studio-letter>
                        {ch}
                      </span>
                    ))}
                  </span>
                </span>
              </span>{" "}
              and software house.
            </span>
            <span className={styles.secondLine}>
              <span className={styles.highlight}>We don&apos;t just</span> execute,
              and we don&apos;t deliver standalone services.
            </span>
            <span className={styles.thirdLine}>
              We build a name, backed by custom software and a marketing
              {/* Desktopon a "system." a 4. sorban ül (lent); mobilon viszont a
                  3. mondat végéhez tartozik, ezért ott külön megjelenítjük. */}
              <span className={styles.systemMobile}>{" "}system.</span>
            </span>
            <span className={styles.fourthLine}>
              <span className={styles.support}>system.</span>{" "}
              <span className={styles.ecosystem}>
                An <span className={styles.highlight}>ecosystem</span>{" "}
                with a single purpose:
              </span>
            </span>
          </p>

          {/* Mobil-only: az ecosystem mondat balra rendezve, a záró nagybetűs
              sorral közös bal éllel. Desktopon rejtve (ott a .lead-ben él). */}
          <p className={styles.kicker} data-reveal>
            An <span className={styles.highlight}>ecosystem</span> with a single
            purpose:
          </p>

          <p className={styles.closing} data-reveal>
            To introduce you to the world.
          </p>
        </div>
      </div>
    </section>
  );
}
