"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import { splitWords } from "./typeIntro";
import {
  HERO_LINE_A,
  HERO_LINE_B,
  HERO_LINE_A_MOBILE,
  HERO_LINE_B_MOBILE,
  initPhases,
  stepWavePath,
  staticWavePath,
} from "./waveEngine";

// A hero egyben a betöltési élmény is. Két intro-variáns létezik, a layout
// gate-scriptje írja ki a html[data-preloader] attribútum értékébe:
//
// "type" (élesben ez fut) — a cím az első festéstől látszik, csak hibásan
//   szedve: opsz 9 display fokozatban, ingadozó vastagsággal, elcsúszott
//   sorvonallal és hibás karaktertávval. A betöltés végére helyreáll. A
//   gesztus a stúdió saját mércéjéről szól, és nincs üres fehér képernyő:
//   a tartalom végig ott van, csak rosszul.
//
// "wave" — a korábbi zaj→nyugalom hullám: a két ambient vonal volatilisen
//   vibrál, majd lecsillapodik a hero lélegzésébe, és csak utána jön a
//   szöveg. Megtartva összehasonlításra, a /preloader oldalon váltható.
//
// Ismételt látogatáskor (nincs attribútum) mindkét esetben a megszokott
// belépő fut: szavak, pont, szignó, majd a vonalak elúszása.

export type IntroVariant = "type" | "wave";

const SESSION_KEY = "lineiq-preloaded";
const MIN_NOISE = 1.1; // wave: ennyit legalább zajong, hogy olvasható legyen
const MAX_NOISE = 2.6; // wave: ennél tovább akkor sem várunk
const MAX_FONT_WAIT = 2.0; // type: a betűre várunk, de nem a végtelenségig

export default function Hero({
  forceIntro = false,
  introVariant,
}: {
  forceIntro?: boolean;
  introVariant?: IntroVariant;
}) {
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

    const gateAttr = document.documentElement.getAttribute("data-preloader");
    const intro = forceIntro || gateAttr !== null;
    const variant: IntroVariant =
      introVariant ?? (gateAttr === "wave" ? "wave" : "type");
    const waveIntro = intro && variant === "wave";
    const typeIntro = intro && variant === "type";

    // A hullám-driver: a calm.pA/pB (0 = zaj, 1 = nyugalom) a két vonal
    // megnyugvási állapota. Csak a wave-variáns indul zajból; a tipográfiai
    // intro alatt a vonalak eleve nyugodtak, csak később úsznak be.
    const calm = { pA: waveIntro ? 0 : 1, pB: waveIntro ? 0 : 1 };
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

    const delayedCalls: gsap.core.Tween[] = [];
    let restoreText: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll<HTMLElement>("[data-hero-word]");
      const dot = root.querySelector("[data-hero-dot]");
      const sig = root.querySelector("[data-hero-sig]");
      const lineSvg = root.querySelector("[data-hero-line]");
      const titleEl = root.querySelector<HTMLElement>("h1");

      if (intro) {
        // a dev hangolóoldalon (forceIntro) nem nyúlunk a scrollhoz
        if (!forceIntro) window.scrollTo(0, 0);
      }

      if (waveIntro) {
        // A gate-CSS a vonalakat is rejti (ne a nyugodt SSR-frame villanjon be
        // a zaj előtt) — az inline visibility itt írja felül, már zaj-módban.
        if (lineSvg) gsap.set(lineSvg, { autoAlpha: 1 });
      } else if (lineSvg) {
        // Tipográfiai intro és ismételt látogatás: a vonalak a szöveg után
        // lélegeznek be.
        gsap.set(lineSvg, { autoAlpha: 0 });
      }

      const tl = gsap.timeline({
        delay: intro ? 0 : 0.2,
        paused: intro,
        onComplete: () => {
          if (!intro) return;
          try {
            sessionStorage.setItem(SESSION_KEY, "true");
          } catch {
            // privát mód — legfeljebb újra lejátszik
          }
        },
      });

      if (waveIntro) {
        // 1) Megnyugvás: a zaj-paraméterek átúsznak a hero ambient értékeibe.
        //    A B vonal kicsit lemaradva követ — előbb az egyik csendesedik el,
        //    aztán a másik, ez adja az organikus "elülés" érzetet.
        tl.to(calm, { pA: 1, duration: 1.8, ease: "power2.out" }, 0).to(
          calm,
          { pB: 1, duration: 1.8, ease: "power2.out" },
          0.22
        );
        // 2) A szöveg már a lecsengés farkán indul; ugyanitt kerül le a
        //    data-preloader attribútum — a navbar CSS-ből úszik be, és a
        //    scroll-zár is ekkor enged fel.
        tl.call(
          () => document.documentElement.removeAttribute("data-preloader"),
          [],
          1.0
        );
      }

      if (typeIntro) {
        // A cím már látszik (hibásan szedve). Karakterekre bontjuk, hogy a
        // helyreállás balról jobbra fusson végig a soron, mint egy szedés,
        // ami leül a helyére. A pont és az aláírás inline rejtve várnak,
        // hogy a gate levétele ne villantsa be őket idő előtt.
        if (dot) gsap.set(dot, { autoAlpha: 0 });
        if (sig) gsap.set(sig, { autoAlpha: 0 });

        // A bontás a KÉSZ állapotban mér (alávágott előtolások, dobozméretek),
        // ezért az intro keverőjét a hívás idejére 1-re állítjuk.
        titleEl?.style.setProperty("--intro-p", "1");
        restoreText = splitWords(Array.from(words), styles.char);
        titleEl?.style.removeProperty("--intro-p");

        const chars = root.querySelectorAll<HTMLElement>(`.${styles.char}`);

        tl.fromTo(
          chars,
          { "--intro-p": 0 },
          {
            "--intro-p": 1,
            // Tempó: a teljes helyreállás = duration + stagger * (karakterek-1),
            // itt ~2.4s. Az 1.65s kapkodásnak hatott, a 3.2s vontatottnak.
            // Az expo.out szándékosan nincs: szinte az egész mozgást az első
            // pillanatba sűríti, amitől a szedés "beugrik" ahelyett, hogy
            // leérkezne — a power2.out egyenletesebben oszlik el.
            duration: 1.6,
            ease: "power2.out",
            stagger: { each: 0.045, from: "start" },
          },
          0
        );

        // A helyreállás vége — a pont ehhez igazodik, nem a scroll-zár
        // feloldásához (a ">" különben a legutóbb hozzáadott elemre nézne).
        tl.addLabel("typeResolved");

        // A scroll-zár és a navbar korán felenged: a cím ekkor már olvasható,
        // csak még rendezkedik. A karakterek saját --intro-p-je felülírja a
        // gyökérét, tehát az attribútum levétele nem szakítja meg a mozgást.
        tl.call(
          () => document.documentElement.removeAttribute("data-preloader"),
          [],
          0.5
        );
      }

      // A szavak beemelése: a wave-intróban és ismételt látogatáskor. A
      // tipográfiai variánsban nincs rá szükség, ott a szöveg végig látszik.
      if (!typeIntro) {
        const textAt = waveIntro ? 1.0 : 0;

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
          textAt
        );
      }

      // a pont saját, játékos érkezése — leesik és pattan, az opacity gyorsan
      // jön, hogy ne örökölje a bounce-ot
      if (dot) {
        const dotAt = typeIntro ? "typeResolved-=0.15" : "-=0.35";
        tl.to(dot, { autoAlpha: 1, duration: 0.3, ease: "power1.out" }, dotAt).from(
          dot,
          { y: -90, duration: 0.9, ease: "bounce.out" },
          "<"
        );
      }

      // "noise off." beírja magát — clip-path wipe balról jobbra, mint egy
      // tollvonás; az intro után ez már összegzés, nem állítás
      if (sig) {
        tl.to(sig, { autoAlpha: 1, duration: 0.01 }, "-=0.3").fromTo(
          sig,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power1.inOut" },
          "<"
        );
      }

      // A vonalak a szöveg után úsznak be — kivéve a wave-intrót, ahol
      // végig ők vitték a gesztust.
      if (!waveIntro && lineSvg) {
        tl.to(lineSvg, { autoAlpha: 1, duration: 2.4, ease: "power2.out" }, ">-0.15");
      }

      // A szedés visszaállítása: a karakter-spanek megszüntetik az alávágást,
      // ezért a kész cím megint egyetlen szövegcsomópont legyen.
      if (typeIntro) {
        // Pontosan a helyreállás pillanatában, nem a timeline végén: ekkor
        // minden karakter p=1-en áll, tehát a pozíciók egyeznek a kész
        // szedéssel, és így a lehető legrövidebb ideig van alávágás nélküli
        // szöveg a képernyőn.
        tl.call(
          () => {
            restoreText?.();
            restoreText = null;
          },
          [],
          "typeResolved"
        );
      }

      if (lineSvg) {
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

      if (waveIntro) {
        // A zaj tartása: legalább MIN_NOISE, a fontok beérkezéséig, de
        // legfeljebb MAX_NOISE — a lecsengés így a valós betöltést követi.
        let minElapsed = false;
        let fontsDone = false;
        let started = false;
        const begin = () => {
          if (started) return;
          started = true;
          tl.play();
        };
        delayedCalls.push(
          gsap.delayedCall(MIN_NOISE, () => {
            minElapsed = true;
            if (fontsDone) begin();
          }),
          gsap.delayedCall(MAX_NOISE, begin)
        );
        if (document.fonts?.ready) {
          document.fonts.ready.then(() => {
            fontsDone = true;
            if (minElapsed) begin();
          });
        } else {
          fontsDone = true;
        }
      } else if (typeIntro) {
        // Nincs mesterséges várakozás: a gesztus tipográfiai, tehát pontosan
        // akkor indul, amikor a betű megérkezett. A cap csak biztosíték.
        let started = false;
        const begin = () => {
          if (started) return;
          started = true;
          tl.play();
        };
        if (document.fonts?.ready) {
          document.fonts.ready.then(begin);
          delayedCalls.push(gsap.delayedCall(MAX_FONT_WAIT, begin));
        } else {
          begin();
        }
      }
    }, root);

    return () => {
      cancelAnimationFrame(raf);
      delayedCalls.forEach((d) => d.kill());
      ctx.revert();
      // ha a komponens az intro közben tűnik el, a szöveg akkor is épen marad
      restoreText?.();
      document.documentElement.removeAttribute("data-preloader");
    };
  }, [forceIntro, introVariant]);

  return (
    <section ref={rootRef} className={styles.hero} id="top">
      <svg
        className={styles.ambientLine}
        data-hero-line
        data-gate-hide
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

      {/* A cím a tipográfiai variánsban az első festéstől látszik, ezért csak
          a wave-intro rejti (data-gate-hide-wave). A pont és az aláírás
          mindkettőben vár. */}
      <div className={`container ${styles.inner}`} data-gate-hide-wave>
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
            <span className={styles.dot} data-hero-dot data-gate-hide>
              .
            </span>
          </span>
        </h1>

        <p className={styles.signature} data-hero-sig data-gate-hide>
          <span className="text-signature">noise off.</span>
        </p>
      </div>
    </section>
  );
}
