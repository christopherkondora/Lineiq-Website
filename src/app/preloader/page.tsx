"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { gsap } from "gsap";
import Preloader, {
  DEFAULT_TIMING,
  type ExitStyle,
  type PreloaderTiming,
  type RevealMode,
} from "../components/Preloader";
import styles from "./preloader.module.css";

// Hangolóoldal a betöltési gesztushoz. Nem másolat: az ÉLES Preloader komponens
// fut benne, embedded módban — így nem tud szétcsúszni attól, ami kimegy.
// Nem kerül a publikus navigációba.
//
// Amit tud, és miért:
// - scrub: lejátszásból csak annyi derül ki, hogy "valami nem stimmel"; a
//   képkockánkénti végignézésből az, hogy pontosan mi.
// - élő számok: fájlszerkesztés + HMR körökben az ember a harmadik legjobb
//   értéknél megáll.
// - hamis késleltetés: localhoston a fontok azonnal megjönnek, tehát a (C) séma
//   LASSÚ ága — ahol a sáv tényleg vár — sosem futna le. Ezt csak így lehet látni.

type LatencyKey = "fonts" | "0" | "800" | "3000" | "never" | "none";

const LATENCY: Record<
  LatencyKey,
  { label: string; gate: "real" | "none"; value?: number | null }
> = {
  fonts: { label: "valós (document.fonts)", gate: "real" },
  "0": { label: "0 ms", gate: "real", value: 0 },
  "800": { label: "800 ms", gate: "real", value: 800 },
  "3000": { label: "3 s", gate: "real", value: 3000 },
  never: { label: "soha (csak a cap old fel)", gate: "real", value: null },
  none: { label: "nincs kapu — tiszta koreográfia", gate: "none" },
};

type Knob = { key: keyof PreloaderTiming; label: string; min: number; max: number };

const KNOBS: Knob[] = [
  { key: "minFill", label: "töltés (min)", min: 0.4, max: 4 },
  { key: "wipe", label: "kitörlés", min: 0.2, max: 2 },
  { key: "rise", label: "betű emelkedés", min: 0.15, max: 1.5 },
  { key: "stagger", label: "stagger (csak sequential)", min: 0, max: 0.4 },
  { key: "hold", label: "megállás", min: 0, max: 1.5 },
  { key: "exit", label: "távozás", min: 0.1, max: 1.5 },
  { key: "gateCap", label: "cap (max várakozás)", min: 1, max: 8 },
  { key: "closeFill", label: "utolsó 10%", min: 0.05, max: 1 },
];

export default function PreloaderHarnessPage() {
  // A useSearchParams Suspense-határt kíván; a fallback szándékosan üres, a
  // query csak azonnal rendelkezésre álló kezdőértékeket ad.
  return (
    <Suspense fallback={null}>
      <PreloaderHarness />
    </Suspense>
  );
}

function PreloaderHarness() {
  // A query renderben olvasva, nem effektben: nincs setState-kaszkád, és az
  // első képkocka már a helyes állapottal születik.
  //   ?p=0.42  — determinisztikus, mélylinkelhető képkocka
  //   ?bare=1  — vezérlők nélkül, teljes nézetben
  //   ?mode=sequential, ?exit=curtain — a változatok is linkelhetők
  const sp = useSearchParams();
  const pParam = sp.get("p");
  const frozen = pParam === null ? null : Number(pParam);
  const bare = sp.get("bare") !== null;

  const [run, setRun] = useState(0);
  const [loop, setLoop] = useState(false);
  const [mode, setMode] = useState<RevealMode>(() =>
    sp.get("mode") === "sequential" ? "sequential" : "synced"
  );
  const [exitStyle, setExitStyle] = useState<ExitStyle>(() =>
    sp.get("exit") === "curtain" ? "curtain" : "dissolve"
  );
  const [latency, setLatency] = useState<LatencyKey>("fonts");
  const [t, setT] = useState<PreloaderTiming>(DEFAULT_TIMING);
  const [duration, setDuration] = useState(0);
  const [build, setBuild] = useState(0);
  const [scrub, setScrub] = useState<number | null>(frozen);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Stabil identitás: a Preloader effektjének függőségei közt szerepelnek, és
  // ha minden renderben újak lennének, a timeline körbe-körbe épülne újra.
  // A build számláló azt jelzi, hogy ÚJ timeline készült — a scrub-pozíciót
  // erre kell visszaállítani, és a hossz önmagában nem árulja el (két hangolás
  // adhat azonos hosszt).
  const handleTimeline = useCallback((tl: gsap.core.Timeline) => {
    tlRef.current = tl;
    setDuration(tl.duration());
    setBuild((b) => b + 1);
  }, []);
  const handleDone = useCallback(() => {}, []);

  const timing = useMemo(() => t, [t]);
  const lat = LATENCY[latency];

  // A scrub-pozíció alkalmazása effektben, nem a callbackben: így nem kell
  // olyan refet írni, amit egy effekt olvas — és minden újraépítés után
  // ugyanoda áll vissza a képkocka.
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl || scrub === null) return;
    tl.pause();
    tl.progress(scrub);
  }, [scrub, build]);

  const replay = useCallback(() => {
    setScrub(null);
    setRun((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!loop || !duration) return;
    const id = setInterval(replay, (duration + 1.2) * 1000);
    return () => clearInterval(id);
  }, [loop, duration, replay]);

  const onScrub = (v: number) => setScrub(v);
  const clearScrub = () => setScrub(null);

  const setKnob = (key: keyof PreloaderTiming, value: number) => {
    setT((prev) => ({ ...prev, [key]: value }));
  };

  // A kapu lejátszás-fogalom: megállítja a timeline-t, amíg a valós jel meg nem
  // érkezik. Scrub és mélylinkelt képkocka közben ennek nincs értelme — ott
  // tiszta koreográfiát nézünk, különben a megérkező jel visszarántja
  // lejátszásba azt, amit épp vizsgálunk.
  const inspecting = frozen !== null || scrub !== null;
  const gate = inspecting ? "none" : lat.gate;
  const autoPlay = !inspecting;

  if (bare) {
    return (
      <main className={styles.bare}>
        <Preloader
          key={`${run}-${mode}-${exitStyle}-${latency}`}
          embedded
          force
          mode={mode}
          exitStyle={exitStyle}
          timing={timing}
          gate={gate}
          simulatedLatency={lat.value}
          autoPlay={autoPlay}
          onTimeline={handleTimeline}
          onDone={handleDone}
        />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <h1 className={`text-section ${styles.title}`}>Preloader — hangolás</h1>
        <p className={styles.lead}>
          A sáv balról jobbra töltődik (folyamatjelző), majd kitörlődik — és a
          nyomában emelkedik ki a <strong>Line</strong> a kézzel rajzolt piros{" "}
          <strong>iQ</strong> mellé. A sáv a szó alapvonala. A végállapot van
          középre igazítva: minden korábbi képkocka ennek részhalmaza, semmi nem
          mozdul vízszintesen.
        </p>
      </div>

      <div className={styles.stage}>
        <Preloader
          key={`${run}-${mode}-${exitStyle}-${latency}`}
          embedded
          force
          mode={mode}
          exitStyle={exitStyle}
          timing={timing}
          gate={gate}
          simulatedLatency={lat.value}
          autoPlay={autoPlay}
          onTimeline={handleTimeline}
          onDone={handleDone}
        />
      </div>

      <div className="container">
        <div className={styles.controls}>
          <div className={styles.row}>
            <button type="button" className={styles.btn} onClick={replay}>
              Újraindítás ↻
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={() => tlRef.current?.play()}
            >
              Play ▶
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={() => tlRef.current?.pause()}
            >
              Pause ⏸
            </button>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={loop}
                onChange={(e) => setLoop(e.target.checked)}
              />
              <span className="text-label">Auto-ismétlés</span>
            </label>
          </div>

          <label className={styles.scrubRow}>
            <span className="text-label">
              scrub — {(scrub ?? 0).toFixed(3)} · {duration.toFixed(2)}s teljes
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={scrub ?? 0}
              onChange={(e) => onScrub(Number(e.target.value))}
            />
          </label>

          <div className={styles.segments}>
            <fieldset className={styles.seg}>
              <legend className="text-label">felfedés</legend>
              {(["synced", "sequential"] as const).map((m) => (
                <label key={m} className={styles.toggle}>
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === m}
                    onChange={() => {
                      setMode(m);
                      clearScrub();
                    }}
                  />
                  <span className="text-label">
                    {m === "synced"
                      ? "synced — a betűk a törlőél nyomában"
                      : "sequential — előbb eltűnik, aztán jönnek"}
                  </span>
                </label>
              ))}
            </fieldset>

            <fieldset className={styles.seg}>
              <legend className="text-label">távozás</legend>
              {(["dissolve", "curtain"] as const).map((x) => (
                <label key={x} className={styles.toggle}>
                  <input
                    type="radio"
                    name="exit"
                    checked={exitStyle === x}
                    onChange={() => {
                      setExitStyle(x);
                      clearScrub();
                    }}
                  />
                  <span className="text-label">{x}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className={styles.seg}>
              <legend className="text-label">valós jel késleltetése</legend>
              {(Object.keys(LATENCY) as LatencyKey[]).map((k) => (
                <label key={k} className={styles.toggle}>
                  <input
                    type="radio"
                    name="latency"
                    checked={latency === k}
                    onChange={() => {
                      setLatency(k);
                      clearScrub();
                    }}
                  />
                  <span className="text-label">{LATENCY[k].label}</span>
                </label>
              ))}
            </fieldset>
          </div>

          <div className={styles.knobs}>
            {KNOBS.map((k) => (
              <label key={k.key} className={styles.knob}>
                <span className="text-label">
                  {k.label} — {t[k.key].toFixed(2)}s
                </span>
                <input
                  type="range"
                  min={k.min}
                  max={k.max}
                  step={0.01}
                  value={t[k.key]}
                  onChange={(e) => setKnob(k.key, Number(e.target.value))}
                />
              </label>
            ))}
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
                setT(DEFAULT_TIMING);
                clearScrub();
              }}
            >
              Alapértékek
            </button>
          </div>

          <pre className={styles.dump}>
            {JSON.stringify(t, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
