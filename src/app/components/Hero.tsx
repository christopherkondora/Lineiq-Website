"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";

type WaveComponent = { amp: number; k: number; speed: number; phase: number };
type WaveLine = { baseline: number; comps: WaveComponent[] };

const TAU = Math.PI * 2;
const WAVE_X0 = -60;
const WAVE_X1 = 1500;
const WAVE_STEP = 60;

// Each line is a sum of long, gentle sines with its own phases and speeds, so
// the crests drift slowly and the two lines fall out of phase with each other.
const LINE_A: WaveLine = {
  baseline: 340,
  comps: [
    { amp: 30, k: TAU / 980, speed: 0.32, phase: 0 },
    { amp: 9, k: TAU / 560, speed: -0.5, phase: 1.1 },
  ],
};

const LINE_B: WaveLine = {
  baseline: 366,
  comps: [
    { amp: 27, k: TAU / 1080, speed: 0.26, phase: 1.8 },
    { amp: 8, k: TAU / 600, speed: 0.44, phase: 0.4 },
  ],
};

// The SVG stretches a 1440-wide viewBox across a ~390px phone (preserveAspectRatio
// "none"), which squeezes the desktop wavelengths into many crests and reads as
// busy. On mobile we stretch the wavelengths ~3x and soften the amplitude and
// drift so only a gentle curve or two crosses the screen — the same calm the
// desktop has.
const LINE_A_MOBILE: WaveLine = {
  baseline: 340,
  comps: [
    { amp: 20, k: TAU / 2900, speed: 0.18, phase: 0 },
    { amp: 6, k: TAU / 1680, speed: -0.28, phase: 1.1 },
  ],
};

const LINE_B_MOBILE: WaveLine = {
  baseline: 366,
  comps: [
    { amp: 18, k: TAU / 3200, speed: 0.15, phase: 1.8 },
    { amp: 5, k: TAU / 1800, speed: 0.25, phase: 0.4 },
  ],
};

// Smooth Catmull-Rom spline through the sampled points (rendered as cubic
// beziers) so the line flows without visible breaking points.
function buildWavePath(line: WaveLine, t: number): string {
  const pts: number[] = [];
  for (let x = WAVE_X0; x <= WAVE_X1; x += WAVE_STEP) {
    let y = line.baseline;
    for (const c of line.comps) {
      y += c.amp * Math.sin(x * c.k + t * c.speed + c.phase);
    }
    pts.push(x, y);
  }

  const n = pts.length / 2;
  const px = (i: number) => pts[Math.max(0, Math.min(n - 1, i)) * 2];
  const py = (i: number) => pts[Math.max(0, Math.min(n - 1, i)) * 2 + 1];

  let d = `M${px(0).toFixed(1)} ${py(0).toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const c1x = px(i) + (px(i + 1) - px(i - 1)) / 6;
    const c1y = py(i) + (py(i + 1) - py(i - 1)) / 6;
    const c2x = px(i + 1) - (px(i + 2) - px(i)) / 6;
    const c2y = py(i + 1) - (py(i + 2) - py(i)) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(2)} ${c2x.toFixed(1)} ${c2y.toFixed(2)} ${px(
      i + 1
    ).toFixed(1)} ${py(i + 1).toFixed(2)}`;
  }
  return d;
}

// Static frame used for SSR / first paint / reduced-motion.
const STATIC_A = buildWavePath(LINE_A, 0);
const STATIC_B = buildWavePath(LINE_B, 0);

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
    const lineA = isMobile ? LINE_A_MOBILE : LINE_A;
    const lineB = isMobile ? LINE_B_MOBILE : LINE_B;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Still pick the right (calmer) frame for mobile when motion is off.
      lineARef.current?.setAttribute("d", buildWavePath(lineA, 0));
      lineBRef.current?.setAttribute("d", buildWavePath(lineB, 0));
      return;
    }

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll("[data-hero-word]");
      const dot = root.querySelector("[data-hero-dot]");
      const sig = root.querySelector("[data-hero-sig]");
      const lineSvg = root.querySelector("[data-hero-line]");

      // lines start hidden — they only breathe in once the type has landed
      if (lineSvg) gsap.set(lineSvg, { autoAlpha: 0 });

      const tl = gsap.timeline({ delay: 0.2 });

      // 1) "Forget being ordinary" rises in word by word
      tl.from(words, {
        yPercent: 100,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.14,
      });

      // 2) the dot gets its own playful entrance — it drops in and bounces,
      //    fading in quickly so the opacity doesn't inherit the bounce
      if (dot) {
        tl.from(dot, { autoAlpha: 0, duration: 0.3, ease: "power1.out" }, "-=0.35")
          .from(dot, { y: -90, duration: 0.9, ease: "bounce.out" }, "<");
      }

      // 3) "noise off." writes itself in — a clip-path wipe left→right reveals
      //    the cursive along its slant, like a pen signing it
      if (sig) {
        tl.fromTo(
          sig,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power1.inOut" },
          "-=0.3"
        );
      }

      // 4) only now do the ambient lines fade in
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
    }, root);

    // Drive the ambient lines: recompute each path from layered sines so the
    // waves ripple and the two lines drift out of phase with each other.
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      lineARef.current?.setAttribute("d", buildWavePath(lineA, t));
      lineBRef.current?.setAttribute("d", buildWavePath(lineB, t));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
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
          d={STATIC_A}
          stroke="var(--color-red)"
          strokeWidth="1.2"
          fill="none"
          className={styles.ambientPath}
        />
        <path
          ref={lineBRef}
          d={STATIC_B}
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
