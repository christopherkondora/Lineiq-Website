"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";
import styles from "./Preloader.module.css";
import {
  BASELINE,
  IQ_D,
  type Letter,
  LETTERS,
  LINE_X0,
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
  minFill: 1.15,
  gateCap: 4,
  closeFill: 0.13,
  wipe: 1.0,
  rise: 0.28,
  stagger: 0.13,
  hold: 0.32,
  // A lepel teljes elvékonyodása. Hosszabb, mint a jel távozása: a hero
  // belépője ~1.1 másodperc, egy fél másodperces fade alatt annak alig a
  // harmada fér el. 0.7 mellett a két mozdulat érdemben átfedi egymást.
  exit: 0.7,
};

// A kitörlés ease-e. A "synced" mód ebből számolja vissza, hogy a törlőél mikor
// ér egy adott betűhöz — ezért kell néven ismernünk, nem elég inline.
//
// Szándékosan LINEÁRIS. Egy inOut ease a pálya közepén a leggyorsabb, épp ott,
// ahol az "i" és az "n" áll: a törlőél a wipe 8, illetve 14 százaléka alatt
// söpört át rajtuk, tehát a ritmus az ease-ből jött, nem a betűközökből, és a
// két középső betű egyszerre villant fel. Egyenletes élsebességgel a felfedés
// üteme tényleg a szó tördeléséből adódik — ezt akarja a gesztus.
const WIPE_EASE = "none";

/** A sáv jobb vége. NEM a "Line" jobb széle (850.2), hanem valamivel előtte.
 *
 *  A szó 850.2-ig ér, a piros iQ 868.3-nál kezdődik — a sáv teli állapotban 18
 *  egységre, kb. 3 képpontra közelítette meg az iQ-t. A betűnél ez nem tűnne
 *  fel, mert az "e" jobb szélső pontja egy vékony, felkunkorodó terminál; a sáv
 *  viszont tömör, függőleges éllel zárul, ráadásul a töltés alatt a betűk még
 *  nincsenek ott. Így a sáv vége nekiment az iQ-nak.
 *
 *  Innen nézve a szóköz, nem a szó szélessége a mérvadó: a sáv ott álljon meg,
 *  ahol még marad rendes optikai hézag a jel másik feléig. */
const TRACK_X1 = 765;

/** Hol tart a törlőél a betűn belül, amikor az emelkedni kezd (0 = bal szél).
 *  A betű a sáv NYOMÁBAN áll fel, nem vele egyszerre: mire elindul, az él már
 *  áthaladt a fele fölött. Bal szélre kötve az "L" a nulladik képkockán, még
 *  teljes hosszú sáv mellett indult — fekete tömbként pattant be. */
const WAKE = 0.5;

/** Mennyivel lóg a parkoló betű a klip éle ALÁ (viewBox-egység). */
const PARK_OVERSHOOT = 4;

/** A sáv vastagsága. NEM a generált fájl BAR_H-ja (7.5): az a MÉRT érték, ami
 *  épp csak befogadja az L talpát (376.9) és az e túllövését (375.1). Mérni
 *  kellett, de a folyamatjelző vastagsága ettől még döntés — ugyanaz a viszony,
 *  mint a TRACK_X1 és a mért LINE_X1 között, ezért itt lakik, nem ott.
 *
 *  7.5 egység a 300 pixeles jelnél 1.6 képpont: tipográfiai hajszálvonal, nem
 *  folyamatjelző. A vastagabb sáv a mért túllövéseket továbbra is elfedi (csak
 *  bővebben), a felfedés logikája pedig változatlan. */
const BAR_THICK = 16;

/** A klip alja = a SÁV alja, nem az alapvonal: az L talpa és az e túllövése a
 *  sáv vastagságába lóg bele, azt a sáv takarja. Együtt mozog a vastagsággal. */
const CLIP_BOTTOM = BASELINE + BAR_THICK;

/** A betű kiinduló helye: a klip alá tolva, tehát nem látszik.
 *
 *  Ez a MARKUPBA is beleíródik, nem csak az effektben áll be. Ha csak a
 *  gsap.set állítaná, a kiszolgált HTML a betűket nyugalmi helyzetben
 *  tartalmazná — vagyis az első képkockán ott áll a teljes fekete "Line", és
 *  csak a hidratálás után ugrik a helyére. Pont ez volt a preloader elején
 *  villanó szó. A kezdőállapot a markupba való, nem egy effektbe. */
const parkY = (letter: Letter) => CLIP_BOTTOM - letter.top + PARK_OVERSHOOT;

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
  /** az éles, teljes képernyős fedő (nem a harness színpada) */
  live?: boolean;
  /** amíg false, a komponens NEM nyúl semmihez: se timeline, se scroll-zár.
   *  A markup ettől még kiszolgálódik, hogy az első festés már helyes legyen —
   *  a hívó egy effektben dönti el, hogy egyáltalán fut-e a gesztus. */
  enabled?: boolean;
  /** reduced-motion kihagyása (csak a hangolóoldalon) */
  force?: boolean;
  autoPlay?: boolean;
  onTimeline?: (tl: gsap.core.Timeline) => void;
  /** a fedő távozni KEZD — innen indulhat a mögötte lévő oldal belépője, hogy
   *  ne legyen üres képkocka a kettő között */
  onExitStart?: () => void;
  onDone?: () => void;
};

export default function Preloader({
  mode = "synced",
  exitStyle = "dissolve",
  timing = DEFAULT_TIMING,
  gate = "real",
  simulatedLatency,
  embedded = false,
  live = false,
  enabled = true,
  force = false,
  autoPlay = true,
  onTimeline,
  onExitStart,
  onDone,
}: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<SVGSVGElement>(null);
  const barRef = useRef<SVGRectElement>(null);
  const clipId = `lineiq-baseline-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    // A hívó még nem döntött (vagy eldöntötte, hogy nincs gesztus): a komponens
    // ilyenkor néma — nem zárja a scrollt és nem épít timeline-t.
    if (!enabled) return;

    const root = rootRef.current;
    const veil = veilRef.current;
    const mark = markRef.current;
    const bar = barRef.current;
    if (!root || !veil || !mark || !bar) return;

    // A gesztus tiszta mozgás: motion-free változata csak egy késleltetés lenne
    // a tartalom előtt, ezért reduced-motion mellett kimarad.
    if (!force && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone?.();
      return;
    }

    const span = TRACK_X1 - LINE_X0;
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
      //
      // Ugyanaz az érték, ami a markupban is ott van: a gsap.set nem beállítja
      // a kezdőállapotot, hanem átveszi a prezentációs attribútumtól, hogy a
      // tween origója egyértelmű legyen. Ezért nincs ugrás a hidratálásnál.
      LETTERS.forEach((l, i) => {
        const el = letterEls[i];
        if (el) gsap.set(el, { y: parkY(l) });
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
        // synced: a betű akkor indul, amikor a törlőél már a WAKE-ig áthaladt
        // fölötte — a ritmus így a betűközökből jön, nem egy fix számból.
        // sequential: a sáv előbb teljesen eltűnik, utána jönnek a betűk.
        const trigger = l.x0 + (l.x1 - l.x0) * WAKE;
        // A sáv rövidebb, mint a szó, tehát egy betű indítópontja elvben a
        // pálya végén túlra eshet; ott a törlőél érkezése a wipe vége.
        const atTrack = Math.min(1, (trigger - LINE_X0) / span);
        const at =
          mode === "synced"
            ? timeAtProgress(WIPE_EASE, atTrack) * timing.wipe
            : timing.wipe + i * timing.stagger;
        // power2.out, nem power3.out: a köbös változat a saját idejének első
        // nyolc százaléka alatt teszi meg az út negyedét, tehát a betű nem
        // emelkedik, hanem bepattan — pont az ellenkezője a kívánt mozdulatnak.
        tl.to(el, { y: 0, duration: timing.rise, ease: "power2.out" }, `reveal+=${at}`);
      });

      tl.addLabel("landed");

      // A mögöttes oldal belépője innen indulhat, a távozás alatt — így a
      // fedő eltűnése és a hero érkezése átfedi egymást, nem követi.
      tl.call(() => onExitStart?.(), [], `landed+=${timing.hold}`);

      const exitAt = `landed+=${timing.hold}`;

      if (exitStyle === "curtain") {
        tl.to(root, { yPercent: -100, duration: timing.exit, ease: "power3.inOut" }, exitAt);
      } else {
        // A távozás két külön mozdulat, nem egy. Korábban a gyökér ment el
        // egyben (autoAlpha + y, power2.in): a befelé gyorsuló fade a saját
        // idejének feléig gyakorlatilag átlátszatlan maradt, tehát a mögötte
        // futó hero-belépő első fele nem látszott — a címsor a semmiből, félig
        // kész állapotban csapódott be. A "beérkezik" helyett "felbukkan".
        //
        // A jel felfelé gyorsulva hagyja el a képet — ez az ő mozdulata, és a
        // vége előtt lezárul, hogy ne kísértsen a felálló címsor fölött.
        tl.to(
          mark,
          { autoAlpha: 0, y: "-2.5vh", duration: timing.exit * 0.6, ease: "power2.in" },
          exitAt
        );
        // A lepel viszont kifelé LASSULVA vékonyodik: az első pillanattól
        // átereszt, tehát a hero mozdulatának az eleje is olvasható rajta. A
        // két gesztus így átfedi egymást, ahogy az onExitStart szándéka is volt.
        tl.to(veil, { autoAlpha: 0, duration: timing.exit, ease: "power1.out" }, exitAt);
        // A fedő ekkor már nem takar, de még elnyelné a kattintást.
        tl.set(root, { pointerEvents: "none" }, exitAt);
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
    enabled,
    force,
    autoPlay,
    onTimeline,
    onExitStart,
    onDone,
  ]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${embedded ? styles.embedded : ""} ${
        live ? styles.live : ""
      }`}
      aria-hidden="true"
    >
      {/* A fehér felület külön réteg, nem a gyökér háttere: a távozáskor a jel
          és a lepel külön ütemben megy el. Egyetlen elemen a kettő
          elkerülhetetlenül ugyanazt az ease-t kapná. */}
      <div ref={veilRef} className={styles.veil} />

      <svg
        ref={markRef}
        className={styles.mark}
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        aria-hidden="true"
      >
        <defs>
          {/* A klip alja a sáv alja, nem az alapvonal: az L talpa és az e
              túllövése a sáv vastagságába lóg bele, azt a sáv takarja. */}
          <clipPath id={clipId}>
            <rect x={-100} y={-200} width={VIEWBOX.w + 200} height={CLIP_BOTTOM + 200} />
          </clipPath>
        </defs>

        {/* A kézzel rajzolt iQ az első képkockától ott áll és vár. */}
        <path d={IQ_D} fill="var(--color-red)" />

        <g clipPath={`url(#${clipId})`}>
          {LETTERS.map((letter) => (
            <g
              key={letter.id}
              data-letter={letter.id}
              transform={`translate(0 ${parkY(letter)})`}
            >
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
          height={BAR_THICK}
          fill="var(--color-black)"
        />
      </svg>
    </div>
  );
}
