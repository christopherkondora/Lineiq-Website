"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Partners.module.css";

// Full-viewport, görgetésre vezérelt "tagadás → állítás" sequence. A szekció egy
// magas wrapper (scroll-budget), benne egy sticky 100vh színpad. A scrub-idővonal
// beatjei: (1) "We don't take on clients" szóról szóra felúszik (hero-recept),
// (2) piros wipe KIZÁRÓLAG a "clients" szón (redaction), (3) az egész sor eltűnik,
// (4) "We take on" + a Kranky "partners" script beíródik, (5) a két hasáb magyarázat
// felúszik, végül a végállapot kitart, amíg a Manifesto fölécsúszik. Mobilon és
// reduced-motion mellett a színpad statikus, minden egyszerre látszik (a CSS base
// layout, JS nélkül).
export default function Partners() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    // A pinnelt sequence minden szélességen fut (telefonon is), kivéve ha a
    // felhasználó csökkentett mozgást kért; a query pontosan egyezik a CSS
    // enhancement feltételével, így a JS-gate és a layout nem csúszik szét.
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const lineOne = root.querySelector<HTMLElement>("[data-line-one]");
        const lineTwo = root.querySelector<HTMLElement>("[data-line-two]");
        const w1 = gsap.utils.toArray<HTMLElement>("[data-word]", root);
        const w2 = gsap.utils.toArray<HTMLElement>("[data-word2]", root);
        const highlight = root.querySelector<HTMLElement>("[data-clients-highlight]");
        const scriptInner = root.querySelector<HTMLElement>("[data-script-inner]");
        const paras = gsap.utils.toArray<HTMLElement>("[data-paras] p", root);

        // Az állítás-blokk kezdetben rejtve, hogy ne fedje át a tagadást; a (4)
        // beatben a tl.set kapcsolja láthatóra (visszafelé görgetve újra elrejti).
        if (lineTwo) gsap.set(lineTwo, { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        // (1) tagadás — szóról szóra felúszik (hero-recept)
        tl.from(
          w1,
          { yPercent: 115, autoAlpha: 0, ease: "none", stagger: 0.12, duration: 1 },
          0
        );

        // (2) piros wipe CSAK a "clients" szón — redaction balról jobbra
        if (highlight) {
          tl.to(highlight, { scaleX: 1, ease: "power2.inOut", duration: 0.6 }, 1.5);
        }

        // (3) az egész tagadás-sor eltűnik (felfelé + fade)
        if (lineOne) {
          tl.to(
            lineOne,
            { yPercent: -35, autoAlpha: 0, ease: "power2.in", duration: 0.7 },
            2.4
          );
        }

        // (4) állítás — "We take on" beúszik, majd a "partners" script
        if (lineTwo) tl.set(lineTwo, { autoAlpha: 1 }, 3.0);
        tl.from(
          w2,
          { yPercent: 115, autoAlpha: 0, ease: "none", stagger: 0.12, duration: 1 },
          3.0
        );
        if (scriptInner) {
          tl.from(
            scriptInner,
            { yPercent: 115, autoAlpha: 0, ease: "none", duration: 1 },
            3.6
          );
        }

        // (5) magyarázat — a hasábok felúsznak
        tl.from(
          paras,
          { yPercent: 40, autoAlpha: 0, ease: "none", stagger: 0.12, duration: 1 },
          4.4
        );

        // Tartás-farok (STOP): a végállapot hosszan kitart, mielőtt a Manifesto
        // fölécsúszik. KRITIKUS: a tartás-faroknak több görgetést kell lefoglalnia,
        // mint a Manifesto 100vh-s takarási ablaka (a .rise -100vh margója), különben
        // a fekete panel már a hasábok beállása közben kezdene takarni. A 4.2-es
        // duration + a 420vh wrapper (CSS) együtt ≈40vh tiszta, statikus holdot hagy
        // a hasábok olvashatóságához, MIELŐTT a takarás elindul.
        tl.to({}, { duration: 4.2 }, 5.4);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.partners} id="partners">
      <div className={styles.stage}>
        <div className={`container ${styles.inner}`}>
          <div className={styles.stageHead}>
            {/* (1–3) tagadás */}
            <h2 className={styles.lineOne} data-line-one>
              <span className={styles.word} data-word>We</span>{" "}
              <span className={styles.word} data-word>don&apos;t</span>{" "}
              <span className={styles.word} data-word>take</span>{" "}
              <span className={styles.word} data-word>on</span>{" "}
              <span className={`${styles.word} ${styles.clients}`} data-word>
                clients
                <span
                  className={styles.clientsHighlight}
                  data-clients-highlight
                  aria-hidden="true"
                />
              </span>
            </h2>

            {/* (4) állítás */}
            <div className={styles.lineTwo} data-line-two>
              <h2 className={styles.lineTwoHead}>
                <span className={styles.word} data-word2>We</span>{" "}
                <span className={styles.word} data-word2>take</span>{" "}
                <span className={styles.word} data-word2>on</span>
              </h2>
              <span className={styles.script}>
                <span className={styles.scriptInner} data-script-inner>
                  partners
                </span>
              </span>
            </div>
          </div>

          {/* (5) magyarázat */}
          <div className={styles.paras} data-paras>
            <div className={styles.col}>
              <p>
                That&apos;s the difference: a studio you keep, not a vendor you
                replace. Built on trust, consistency, and a point of view.
              </p>
              <p>
                Curious, transparent, ambitious. And a little obsessed with the
                details most people never notice.
              </p>
            </div>
            <div className={styles.col}>
              <p>
                Setup, a retainer, and a real relationship behind both. We pick up
                the phone, and we show up in person.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
