"use client";

import { useEffect, useRef, useState } from "react";
import Hero, { type IntroVariant } from "../components/Hero";
import {
  HERO_LINE_A,
  HERO_LINE_B,
  initPhases,
  stepWavePath,
} from "../components/waveEngine";
import styles from "./preloader.module.css";

// Fejlesztői aloldal a zaj→nyugalom hero-intro hangolásához. Két felület:
// 1) Scrub — csúszkával kézzel vezérelhető a p (megnyugvás), a közös
//    hullámmotoron; itt lőhető be a volatile paraméterkészlet karaktere.
// 2) Teljes intro — maga az éles Hero komponens forceIntro módban, replay
//    gombbal újraindítva; nincs külön másolat, ami szétcsúszhatna az élestől.
// Nem kerül a publikus navigációba.

function NoiseScrub() {
  const [p, setP] = useState(0);
  const pRef = useRef(0);
  const lineARef = useRef<SVGPathElement>(null);
  const lineBRef = useRef<SVGPathElement>(null);

  // A rAF-hurok a ref-en át olvassa a csúszka értékét, hogy ne kelljen
  // minden lépésnél újraindulnia; a szinkronizálás effektben történik, nem renderben.
  useEffect(() => {
    pRef.current = p;
  }, [p]);

  useEffect(() => {
    const phasesA = initPhases(HERO_LINE_A);
    const phasesB = initPhases(HERO_LINE_B);
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      lineARef.current?.setAttribute(
        "d",
        stepWavePath(HERO_LINE_A, phasesA, dt, pRef.current)
      );
      lineBRef.current?.setAttribute(
        "d",
        stepWavePath(HERO_LINE_B, phasesB, dt, pRef.current)
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={styles.scrub}>
      <div className={styles.scrubStage}>
        <svg viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">
          <path ref={lineARef} stroke="var(--color-red)" strokeWidth="1.2" fill="none" />
          <path
            ref={lineBRef}
            stroke="var(--color-red)"
            strokeWidth="0.8"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>
      <label className={styles.scrubControl}>
        <span className="text-label">
          megnyugvás (p) — {p.toFixed(2)} {p === 0 ? "· tiszta zaj" : p === 1 ? "· hero ambient" : ""}
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={p}
          onChange={(e) => setP(Number(e.target.value))}
        />
      </label>
    </div>
  );
}

// A tipográfiai intro a vonalak beúszásával együtt ~6s; ennyi szünettel
// indul újra, hogy a végállapot megálljon egy pillanatra.
const LOOP_MS = 8000;

export default function PreloaderPage() {
  const [run, setRun] = useState(0);
  const [loop, setLoop] = useState(false);
  const [variant, setVariant] = useState<IntroVariant>("type");

  useEffect(() => {
    if (!loop) return;
    const id = setInterval(() => setRun((n) => n + 1), LOOP_MS);
    return () => clearInterval(id);
  }, [loop]);

  return (
    <main className={styles.page}>
      <div className="container">
        <h1 className={`text-section ${styles.title}`}>
          Hero-intro — variánsok
        </h1>

        <p className={styles.lead}>
          Két betöltési gesztus, ugyanazzal az éles Hero komponenssel.{" "}
          <strong>Type</strong>: a cím hibásan szedve indul (opsz 9 display
          fokozatban) és a helyes szedésbe áll össze. <strong>Wave</strong>: a
          korábbi zaj→nyugalom hullám. Alul a scrub a hullámmotort hangolja.
        </p>

        <div className={styles.variantRow}>
          {(["type", "wave"] as const).map((v) => (
            <label key={v} className={styles.loopToggle}>
              <input
                type="radio"
                name="variant"
                checked={variant === v}
                onChange={() => {
                  setVariant(v);
                  setRun((n) => n + 1);
                }}
              />
              <span className="text-label">{v}</span>
            </label>
          ))}
        </div>

        <div className={styles.replayRow}>
          <button
            type="button"
            className={styles.replayBtn}
            onClick={() => setRun((n) => n + 1)}
          >
            Intro újraindítása ↻
          </button>

          <label className={styles.loopToggle}>
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => setLoop(e.target.checked)}
            />
            <span className="text-label">
              Auto-ismétlés ({LOOP_MS / 1000}s)
            </span>
          </label>
        </div>
      </div>

      <div className={styles.heroFrame}>
        <Hero key={run} forceIntro introVariant={variant} />
      </div>

      <div className="container">
        <NoiseScrub />
      </div>
    </main>
  );
}
