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

    // A pre-paint rejtést (CSS, html[data-enter]) innentől a GSAP inline
    // stílusai váltják. A levétel és a timeline felépítése UGYANABBAN a
    // szinkron blokkban történik, tehát a böngésző nem fest közéjük: a
    // fromTo-tweenek immediateRenderje már a felépítéskor kiírja a kiinduló
    // állapotot. Ha ezt a sort később hívnánk, pont az a villanás jönne
    // vissza, amit a CSS-állapot megszüntet.
    document.documentElement.removeAttribute("data-enter");

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll<HTMLElement>("[data-hero-word]");
      const dot = root.querySelector("[data-hero-dot]");
      const sig = root.querySelector("[data-hero-sig]");
      const lineSvg = root.querySelector("[data-hero-line]");

      // A vonalak a szöveg után úsznak be. Az aláírást is itt rejtjük el
      // inline stílussal: a CSS kezdőállapota a data-enter levételével
      // megszűnt, a saját tweenje viszont csak később, `to`-val nyitja ki —
      // enélkül a hidratálástól a belépőjéig végig látszana.
      if (lineSvg) gsap.set(lineSvg, { autoAlpha: 0 });
      if (sig) gsap.set(sig, { autoAlpha: 0 });

      const tl = gsap.timeline({
        delay: waitsForIntro ? 0 : 0.2,
        paused: waitsForIntro,
      });

      // "Forget being ordinary" szavanként emelkedik be. A mozgás és a
      // fedettség KÜLÖN tween: közös power4.out mellett a szó a saját idejének
      // első tizede alatt megtette az út harmadát, és ugyanennyi idő alatt vette
      // fel a fedettség harmadát is — vagyis nem beúszott, hanem bevillant.
      // Külön véve a szó lassabban válik láthatóvá, mint amilyen gyorsan
      // elindul: a fedő elvékonyodó fehérjén már a mozdulat ELEJE is átlátszik,
      // nem egy félig kész címsor bukkan fel a végén.
      //
      // fromTo, nem from: a kiinduló állapotot a CSS is leírja (data-enter),
      // és a `from` a MEGLÉVŐ értéket venné végállapotnak — vagyis 100%-ról
      // 100%-ra animálna, azaz sehova. A kiinduló értékek szándékosan
      // egyeznek a CSS-beliekkel.
      tl.fromTo(
        words,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.1, ease: "power3.out", stagger: 0.12 },
        0
      );
      tl.fromTo(
        words,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.8, ease: "power1.out", stagger: 0.12 },
        0
      );

      // a pont saját, játékos érkezése — leesik és pattan, a fedettség gyorsan
      // jön, hogy ne örökölje a bounce-ot.
      //
      // fromTo, nem to: a kiinduló rejtettség így a tweené, tehát már a timeline
      // FELÉPÍTÉSEKOR érvényes. A `to` változat semmit nem rejtett el — a pont
      // a CSS-ből örökölt teljes fedettséggel, a végleges helye fölött 90
      // pixellel állt a hidratálástól a saját belépőjéig. A fedő
      // elvékonyodásakor tehát egy magában lebegő piros pont fogadta a
      // látogatót, egy másodperccel a hozzá tartozó szó előtt.
      if (dot) {
        tl.fromTo(
          dot,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3, ease: "power1.out" },
          "-=0.35"
        ).fromTo(
          dot,
          { y: -90 },
          { y: 0, duration: 0.9, ease: "bounce.out" },
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
