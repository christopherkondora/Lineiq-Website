"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import {
  HERO_LINE_A,
  HERO_LINE_B,
  HERO_LINE_A_MOBILE,
  HERO_LINE_B_MOBILE,
  initPhases,
  stepWavePath,
  staticWavePath,
} from "./waveEngine";

// A hero már NEM viszi a betöltési élményt. Korábban két intro-variáns élt
// benne (a hibásan szedett cím és a zaj→nyugalom hullám), egy futásidejű
// szedő, egy font-verseny és a scroll-zár feloldása — mind egyetlen effektben.
// A gesztus átkerült a [[components/Preloader]] fedőbe, itt csak a belépő
// maradt: a szavak beemelkednek, a pont leesik, az aláírás beírja magát, végül
// a vonalak belélegeznek.
//
// Az egyetlen kapcsolat a kettő között az időzítés: ha fut a betöltési gesztus,
// a belépő megvárja. Nem a végét, hanem a fedő TÁVOZÁSÁNAK kezdetét — így a
// két mozdulat átfedi egymást, és nincs üres képkocka a kettő között.

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const lineARef = useRef<SVGPathElement>(null);
  const lineBRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const lineA = isMobile ? HERO_LINE_A_MOBILE : HERO_LINE_A;
    const lineB = isMobile ? HERO_LINE_B_MOBILE : HERO_LINE_B;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Statikus calm frame — mobilon is a szelídebb paraméterekkel.
      lineARef.current?.setAttribute("d", staticWavePath(lineA));
      lineBRef.current?.setAttribute("d", staticWavePath(lineB));
      return;
    }

    // A vonalak mindig nyugodtan lélegeznek: a zaj-fázis a hullám-intróval
    // együtt megszűnt, a driver maga viszont kell, ez a hero ambient mozgása.
    const calm = { pA: 1, pB: 1 };
    const phasesA = initPhases(lineA);
    const phasesB = initPhases(lineB);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // tab-váltás után ne ugorjon nagyot a fázis
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      lineARef.current?.setAttribute("d", stepWavePath(lineA, phasesA, dt, calm.pA));
      lineBRef.current?.setAttribute("d", stepWavePath(lineB, phasesB, dt, calm.pB));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Fut-e épp a betöltési gesztus? Ha igen, a belépő az ő jelzésére indul.
    const waitsForIntro = document.documentElement.hasAttribute("data-intro");
    let onIntroDone: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll<HTMLElement>("[data-hero-word]");
      const dot = root.querySelector("[data-hero-dot]");
      const sig = root.querySelector("[data-hero-sig]");
      const lineSvg = root.querySelector("[data-hero-line]");

      // A vonalak a szöveg után úsznak be.
      if (lineSvg) gsap.set(lineSvg, { autoAlpha: 0 });

      const tl = gsap.timeline({
        delay: waitsForIntro ? 0 : 0.2,
        paused: waitsForIntro,
      });

      // "Forget being ordinary" szavanként emelkedik be
      tl.from(
        words,
        {
          yPercent: 100,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.14,
        },
        0
      );

      // a pont saját, játékos érkezése — leesik és pattan, az opacity gyorsan
      // jön, hogy ne örökölje a bounce-ot
      if (dot) {
        tl.to(dot, { autoAlpha: 1, duration: 0.3, ease: "power1.out" }, "-=0.35").from(
          dot,
          { y: -90, duration: 0.9, ease: "bounce.out" },
          "<"
        );
      }

      // "noise off." beírja magát — clip-path wipe balról jobbra, mint egy
      // tollvonás
      if (sig) {
        tl.to(sig, { autoAlpha: 1, duration: 0.01 }, "-=0.3").fromTo(
          sig,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power1.inOut" },
          "<"
        );
      }

      if (lineSvg) {
        tl.to(lineSvg, { autoAlpha: 1, duration: 2.4, ease: "power2.out" }, ">-0.15");

        gsap.to(lineSvg, {
          yPercent: -25,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (waitsForIntro) {
        onIntroDone = () => tl.play();
        window.addEventListener("lineiq:intro-done", onIntroDone, { once: true });
      }
    }, root);

    return () => {
      cancelAnimationFrame(raf);
      if (onIntroDone) window.removeEventListener("lineiq:intro-done", onIntroDone);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.hero} id="top">
      <svg
        className={styles.ambientLine}
        data-hero-line
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={lineARef}
          d={staticWavePath(HERO_LINE_A)}
          stroke="var(--color-red)"
          strokeWidth="1.2"
          fill="none"
          className={styles.ambientPath}
        />
        <path
          ref={lineBRef}
          d={staticWavePath(HERO_LINE_B)}
          stroke="var(--color-red)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
          className={styles.ambientPath2}
        />
      </svg>

      <div className={`container ${styles.inner}`}>
        <h1 className={styles.title}>
          <span className={styles.word} data-hero-word>
            Forget
          </span>{" "}
          <span className={styles.word} data-hero-word>
            being
          </span>
          <br />
          <span className={styles.ordinaryWrap}>
            {/* no whitespace between word and dot — they must read "ordinary." */}
            <span className={styles.word} data-hero-word>
              ordinary
            </span>
            <span className={styles.dot} data-hero-dot>
              .
            </span>
          </span>
        </h1>

        <p className={styles.signature} data-hero-sig>
          <span className="text-signature">noise off.</span>
        </p>
      </div>
    </section>
  );
}
