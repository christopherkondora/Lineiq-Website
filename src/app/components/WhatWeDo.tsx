"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import styles from "./WhatWeDo.module.css";
import { services } from "../data/services";

// bymonolog.com "what we can help with" receptje, fehér szekción, LineiQ
// tipográfiával: jobb oldalt óriás, egymásra rakott Fraunces szolgáltatás-nevek
// (a nem-aktívak 0.3-ra halványulnak), mellettük egyetlen 4:5 noir fotó, ami a
// ripelt MONOLOG ut() függvény szerint SIMÁN úszik az aktív névhez (translateY
// tween ease-transition-nel, kép-crossfade ease-fade-del). Bal oldalt egy
// beszédes mondat + egy egyszerű, átsuhanó vonal-animáció.
export default function WhatWeDo() {
  const rootRef = useRef<HTMLElement>(null);

  // A home page a .stackSticky wrapperben parkoltatja ezt a szekciót, miközben
  // a Manifesto fölé csúszik (page.module.css). A sticky wrappernek a saját
  // rendert magassága kell --stack-sticky-h-ként, hogy alulra igazítva tudjon
  // parkolni; CSS önmagában nem tud egy elem saját magasságára hivatkozni.
  // Reduced motion mellett is fut — ez pozicionálás, nem animáció.
  useEffect(() => {
    const sticky = rootRef.current?.parentElement;
    if (!sticky) return;
    const ro = new ResizeObserver(() => {
      sticky.style.setProperty("--stack-sticky-h", `${sticky.offsetHeight}px`);
    });
    ro.observe(sticky);
    return () => ro.disconnect();
  }, []);

  // A fotó az aktív névhez úszik. A ripelt bundle ut() függvényének portja:
  // a kártya translateY-ját az aktív sor függőleges középpontjához tweeneljük.
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger, CustomEase);

    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // ripelt MONOLOG ease-ek + időtartam
      CustomEase.create("ease-transition", "0.22, 1, 0.36, 1");
      CustomEase.create("ease-fade", "0.76, 0, 0.24, 1");
      const SLOW = 1.075;

      const content = root.querySelector<HTMLElement>(`.${styles.content}`);
      const card = root.querySelector<HTMLElement>(`.${styles.card}`);
      const inner = root.querySelector<HTMLElement>(`.${styles.cardInner}`);
      if (!content || !card || !inner) return;

      const triggers = gsap.utils.toArray<HTMLElement>("[data-trigger]", root);
      const images = gsap.utils.toArray<HTMLElement>("[data-img]", root);
      let first = true;
      let currentIdx = 0;

      // a kártya belép: elmosódásból, enyhén alulról, amikor a szekció a nézetbe ér
      if (!reduce) {
        gsap.from(inner, {
          opacity: 0,
          yPercent: 8,
          filter: "blur(6px)",
          duration: SLOW,
          ease: "ease-transition",
          scrollTrigger: { trigger: root, start: "top 75%" },
        });
        gsap.from(root.querySelectorAll("[data-reveal]"), {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 70%" },
        });
      }

      // egy sor függőleges középpontja a content dobozhoz mérve
      const centerY = (el: HTMLElement) => {
        const r = content.getBoundingClientRect();
        const c = el.getBoundingClientRect();
        return c.top - r.top + c.height / 2;
      };
      const moveTo = (el: HTMLElement) => {
        const y = centerY(el);
        if (first || reduce) {
          first = false;
          gsap.set(card, { y });
        } else {
          gsap.to(card, { y, duration: SLOW, ease: "ease-transition" });
        }
      };
      const setActive = (i: number) => {
        currentIdx = i;
        images.forEach((img, c) => {
          gsap.to(img, { opacity: c === i ? 1 : 0, duration: 0.2, ease: "ease-fade" });
        });
        triggers.forEach((t, c) => {
          gsap.to(t, { opacity: c === i ? 1 : 0.3, duration: 0.2, ease: "ease-fade" });
        });
      };

      setActive(0);
      moveTo(triggers[0]);
      triggers.forEach((t, i) =>
        t.addEventListener("pointerenter", () => {
          setActive(i);
          moveTo(t);
        })
      );

      // ha a layout újrarendeződik, igazítsuk a kártyát az aktív sorhoz
      const onResize = () => gsap.set(card, { y: centerY(triggers[currentIdx]) });
      window.addEventListener("resize", onResize);
      ScrollTrigger.addEventListener("refresh", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        ScrollTrigger.removeEventListener("refresh", onResize);
      };
    }, root);

    // a sorpozíciók a Fraunces betöltése után pontosak; mérés utána
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.whatwedo} id="szolgaltatasok">
      <div className={`container ${styles.inner}`}>
        <div className={styles.layout}>
          {/* Bal: egy beszédes mondat + egyszerű vonal-animáció */}
          <aside className={styles.rail}>
            <div className={styles.statement} data-reveal>
              <div className={styles.line} aria-hidden="true">
                <span />
              </div>
              <p className={styles.statementText}>
                Olyat építünk, ami helyetted is dolgozik.
              </p>
            </div>
          </aside>

          {/* Jobb: óriás szolgáltatás-lista + úszó fotó */}
          <div className={styles.main}>
            <div className={styles.content}>
              <ul className={styles.list}>
                {services.map((s) => (
                  <li key={s.slug} className={styles.rowItem} data-reveal>
                    <Link
                      href={`/mit-nyujtunk/${s.slug}`}
                      className={styles.row}
                      data-trigger
                    >
                      <h3 className={styles.rowTitle}>{s.title}</h3>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className={styles.card}>
                <div className={styles.cardCenterer}>
                  <div className={styles.cardInner}>
                    {services.map((s) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={s.slug}
                        data-img
                        className={styles.img}
                        src={`/services/${s.slug}.jpg`}
                        alt=""
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
