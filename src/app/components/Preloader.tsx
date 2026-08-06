"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";
import styles from "./Preloader.module.css";
import {
  BASELINE,
  BAR_H,
  CLIP_Y,
  IQ_D,
  LETTERS,
  LINE_X0,
  LINE_X1,
  VIEWBOX,
} from "./lineiqWordmark";

// A betöltési gesztus: egy fekete sáv balról jobbra töltődik (ez a folyamatjelző),
// majd ugyanez a sáv kitörlődik — és a helyén, a nyomában emelkedik ki a "Line",
// a betöltés alatt végig ott álló, kézzel rajzolt piros "iQ" mellé. A folyamatjelző
// maga a logó volt. A sáv a szó ALAPVONALÁN ül, a betűk FÖLÖTTE állnak fel: azonos
// x, egymás fölött — nem a sáv helyére kerülnek, hanem a nyomába.

export type RevealMode = "synced" | "sequential";
export type ExitStyle = "dissolve" | "curtain";

export type PreloaderTiming = {
  /** a sáv 0 → 90%-ig, koreografált ütemben */
  minFill: number;
  /** meddig várunk legfeljebb a valós jelre */
  gateCap: number;
  /** a maradék 10%, miután a valós jel megérkezett */
  closeFill: number;
  /** a sáv kitörlése balról jobbra */
  wipe: number;
  /** egy betű felemelkedése */
  rise: number;
  /** csak "sequential" módban: fix késleltetés betűnként */
  stagger: number;
  /** a kész logó megállása, mielőtt távozik */
  hold: number;
  exit: number;
};

export const DEFAULT_TIMING: PreloaderTiming = {
  minFill: 1.6,
  gateCap: 4,
  closeFill: 0.3,
  wipe: 0.75,
  rise: 0.55,
  stagger: 0.09,
  hold: 0.45,
  exit: 0.5,
};

// A kitörlés ease-e. A "synced" mód ebből számolja vissza, hogy a törlőél mikor
// ér egy adott betű bal széléhez — ezért kell néven ismernünk, nem elég inline.
const WIPE_EASE = "power1.inOut";

/** Mennyivel lóg a parkoló betű a klip éle ALÁ (viewBox-egység). */
const PARK_OVERSHOOT = 4;

/** Az ease invertálása: milyen t-nél veszi fel az ease a megadott értéket. */
function timeAtProgress(easeName: string, target: number): number {
  const ease = gsap.parseEase(easeName);
  if (!ease) return target;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 32; i += 1) {
    const mid = (lo + hi) / 2;
    if (ease(mid) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export type PreloaderProps = {
  mode?: RevealMode;
  exitStyle?: ExitStyle;
  timing?: PreloaderTiming;
  /** "real": megvárja a valós jelet (fontok); "none": tiszta koreográfia (scrubhoz) */
  gate?: "real" | "none";
  /** harness: hamis késleltetés ms-ban, hogy a lassú ág is látható legyen.
   *  null = a jel SOHA nem érkezik meg, csak a gateCap old fel. */
  simulatedLatency?: number | null;
  /** a hangolóoldal színpadába ágyazva: nem fixed és nem zárja a scrollt */
  embedded?: boolean;
  /** reduced-motion kihagyása (csak a hangolóoldalon) */
  force?: boolean;
  autoPlay?: boolean;
  onTimeline?: (tl: gsap.core.Timeline) => void;
  onDone?: () => void;
};

export default function Preloader({
  mode = "synced",
  exitStyle = "dissolve",
  timing = DEFAULT_TIMING,
  gate = "real",
  simulatedLatency,
  embedded = false,
  force = false,
  autoPlay = true,
  onTimeline,
  onDone,
}: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<SVGRectElement>(null);
  const clipId = `lineiq-baseline-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = rootRef.current;
    const bar = barRef.current;
    if (!root || !bar) return;

    // A gesztus tiszta mozgás: motion-free változata csak egy késleltetés lenne
    // a tartalom előtt, ezért reduced-motion mellett kimarad.
    if (!force && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone?.();
      return;
    }

    const span = LINE_X1 - LINE_X0;
    const fill = { p: 0 };
    const wipe = { p: 0 };

    // A sáv egyetlen rect: a bal széle a törlés, a jobb a töltés. Nem kell
    // hozzá maszk, és a két fázis ugyanazt az elemet mozgatja.
    const drawBar = () => {
      const left = LINE_X0 + span * wipe.p;
      const right = LINE_X0 + span * fill.p;
      bar.setAttribute("x", String(left));
      bar.setAttribute("width", String(Math.max(0, right - left)));
    };
    drawBar();

    // A scroll-zárat az a komponens teszi fel, amelyik le is veszi — és a kettő
    // együtt kerül be/ki a DOM-ba. A régi rendszer azért tudott beragadni, mert
    // a zár a layoutban élt, a feloldás meg egy komponensben, ami nem volt ott.
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    if (!embedded) html.style.overflow = "hidden";
    const releaseScroll = () => {
      if (!embedded) html.style.overflow = prevOverflow;
    };

    let resolved = gate === "none";
    // Csak azt a szünetet oldjuk fel, amit MI tettünk be a kapunál. Ha a hívó
    // állította meg (scrub, mélylinkelt képkocka), a jel megérkezése nem
    // ránthatja vissza lejátszásba.
    let pausedByGate = false;

    const ctx = gsap.context(() => {
      const letterEls = LETTERS.map((l) =>
        root.querySelector<SVGGElement>(`[data-letter="${l.id}"]`)
      );

      // Kiinduló állapot: minden betű a klip alá tolva, tehát nem látszik.
      // A ráadás azért kell, mert pontosan a klip élére állítva a betűtetők
      // élsimítása halvány hajszálvonalat rajzol oda, ahol majd a sáv lesz —
      // egy kísértet-sáv a nulladik képkockán.
      LETTERS.forEach((l, i) => {
        const el = letterEls[i];
        if (el) gsap.set(el, { y: CLIP_Y - l.top + PARK_OVERSHOOT });
      });

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          releaseScroll();
          onDone?.();
        },
      });

      tl.to(
        fill,
        { p: 0.9, duration: timing.minFill, ease: "power2.out", onUpdate: drawBar },
        0
      );
      tl.addLabel("gate");

      // A (C) séma: a koreográfia 90%-ig magától fut, az utolsó 10% a valós
      // jelre vár. Amelyik később van — a script vagy a valóság — az nyer.
      if (gate === "real") {
        tl.call(
          () => {
            if (resolved) return;
            pausedByGate = true;
            tl.pause();
          },
          [],
          "gate"
        );
      }

      tl.to(
        fill,
        { p: 1, duration: timing.closeFill, ease: "power1.inOut", onUpdate: drawBar },
        "gate"
      );
      tl.addLabel("reveal");

      tl.to(
        wipe,
        { p: 1, duration: timing.wipe, ease: WIPE_EASE, onUpdate: drawBar },
        "reveal"
      );

      LETTERS.forEach((l, i) => {
        const el = letterEls[i];
        if (!el) return;
        // synced: a betű akkor indul, amikor a törlőél a bal széléhez ér — a
        // ritmus így a betűközökből jön, nem egy fix számból.
        // sequential: a sáv előbb teljesen eltűnik, utána jönnek a betűk.
        const at =
          mode === "synced"
            ? timeAtProgress(WIPE_EASE, (l.x0 - LINE_X0) / span) * timing.wipe
            : timing.wipe + i * timing.stagger;
        tl.to(el, { y: 0, duration: timing.rise, ease: "power3.out" }, `reveal+=${at}`);
      });

      tl.addLabel("landed");

      if (exitStyle === "curtain") {
        tl.to(
          root,
          { yPercent: -100, duration: timing.exit, ease: "power3.inOut" },
          `landed+=${timing.hold}`
        );
      } else {
        tl.to(
          root,
          { autoAlpha: 0, y: "-2.5vh", duration: timing.exit, ease: "power2.in" },
          `landed+=${timing.hold}`
        );
      }

      // A lejátszás indul először, és csak utána kapja meg a hívó a timeline-t:
      // így egy onTimeline, ami adott progressre állítja (mélylinkelt képkocka),
      // felül tudja írni az autoPlayt ahelyett, hogy az írná felül őt.
      if (autoPlay) tl.play();
      onTimeline?.(tl);

      if (gate === "real") {
        const release = () => {
          if (resolved) return;
          resolved = true;
          if (!pausedByGate) return;
          pausedByGate = false;
          tl.play();
        };
        if (simulatedLatency === null) {
          // szándékosan sosem old fel — csak a cap; ezt teszteljük a harness-ben
        } else if (typeof simulatedLatency === "number") {
          gsap.delayedCall(simulatedLatency / 1000, release);
        } else if (document.fonts?.ready) {
          document.fonts.ready.then(release);
        } else {
          release();
        }
        // Biztosíték: rossz kapcsolat sem tarthatja bent a látogatót.
        gsap.delayedCall(timing.gateCap, release);
      }
    }, root);

    return () => {
      ctx.revert();
      releaseScroll();
    };
  }, [
    mode,
    exitStyle,
    timing,
    gate,
    simulatedLatency,
    embedded,
    force,
    autoPlay,
    onTimeline,
    onDone,
  ]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${embedded ? styles.embedded : ""}`}
      aria-hidden="true"
    >
      <svg
        className={styles.mark}
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        aria-hidden="true"
      >
        <defs>
          {/* A klip alja a sáv alja, nem az alapvonal: az L talpa és az e
              túllövése a sáv vastagságába lóg bele, azt a sáv takarja. */}
          <clipPath id={clipId}>
            <rect x={-100} y={-200} width={VIEWBOX.w + 200} height={CLIP_Y + 200} />
          </clipPath>
        </defs>

        {/* A kézzel rajzolt iQ az első képkockától ott áll és vár. */}
        <path d={IQ_D} fill="var(--color-red)" />

        <g clipPath={`url(#${clipId})`}>
          {LETTERS.map((letter) => (
            <g key={letter.id} data-letter={letter.id}>
              {letter.d.map((d, i) => (
                <path key={i} d={d} fill="var(--color-black)" />
              ))}
            </g>
          ))}
        </g>

        <rect
          ref={barRef}
          x={LINE_X0}
          y={BASELINE}
          width={0}
          height={BAR_H}
          fill="var(--color-black)"
        />
      </svg>
    </div>
  );
}
