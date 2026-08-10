"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SplashLink from "./SplashLink";
import CtaSwap from "./CtaSwap";
import styles from "./SequenceSection.module.css";
import {
  FOOTER_CHANNELS,
  FOOTER_LABELS,
  FOOTER_LEGAL_LINKS,
  FOOTER_SITEMAP,
  FOOTER_STUDIO,
  footerCopyright,
} from "../data/footer";

const FRAME_COUNT = 40;
const frameSrc = (i: number) =>
  `/frames/frame-${String(i + 1).padStart(4, "0")}.jpg`;

export default function SequenceSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const endTextRef = useRef<HTMLDivElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Mobilon a szekció teljesen ki van kapcsolva (a .wrapper CSS-ben
    // display:none ≤900px). Itt is kilépünk, hogy a 40 frame (~3.6 MB) be se
    // töltődjön és a scroll-listener se fusson feleslegesen.
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = (index: number) => {
      const img = frames.current[index];
      if (!img?.complete || img.naturalWidth === 0) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dx = (cw - img.naturalWidth * scale) / 2;
      const dy = (ch - img.naturalHeight * scale) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, img.naturalWidth * scale, img.naturalHeight * scale);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrame.current);
    };

    // Frame 0 loads immediately so the canvas has something to paint; the
    // remaining 39 frames (~3.6 MB) are deferred to browser idle time so they
    // don't compete with above-the-fold assets on initial load. The section
    // sits 350vh down, so idle loading finishes long before the user scrolls
    // here; drawFrame already skips any frame that isn't loaded yet.
    frames.current = Array.from({ length: FRAME_COUNT }, () => new Image());
    const loadFrame = (i: number) => {
      const img = frames.current[i];
      if (img.src) return;
      if (i === 0) img.onload = () => drawFrame(0);
      img.src = frameSrc(i);
    };
    loadFrame(0);
    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const idleId = idle(() => {
      for (let i = 1; i < FRAME_COUNT; i++) loadFrame(i);
    });

    resize();
    window.addEventListener("resize", resize);

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));

      const frame = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
      if (frame !== currentFrame.current) {
        currentFrame.current = frame;
        drawFrame(frame);
      }

      if (endTextRef.current) {
        const t = Math.max(0, (progress - 0.8) / 0.2);
        endTextRef.current.style.opacity = String(Math.min(1, t));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleId as number);
      else window.clearTimeout(idleId as number);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper} data-dark data-always-header>
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} />

        <div ref={endTextRef} className={styles.endText}>
          <p className={styles.endHeadline}>Ready?</p>
          <SplashLink href="/contact" className={styles.endCta}>
            <CtaSwap defaultLabel="Let's begin." hoverLabel="Let's go!" />
          </SplashLink>
        </div>

        <div className={styles.footerOverlay}>
          <div className={styles.footerGrid}>
            <div>
              <p className={styles.footerLabel}>{FOOTER_LABELS.studio}</p>
              <p className={styles.footerText}>
                {FOOTER_STUDIO.name}
                <br />
                {FOOTER_STUDIO.city}
              </p>
            </div>
            <div>
              <p className={styles.footerLabel}>{FOOTER_LABELS.sitemap}</p>
              <ul className={styles.footerList}>
                {FOOTER_SITEMAP.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={styles.footerLabel}>{FOOTER_LABELS.connect}</p>
              {/* Channels without a live URL render as plain text — no dead links. */}
              <ul className={styles.footerList}>
                {FOOTER_CHANNELS.map((c) => (
                  <li key={c}>
                    <span className={styles.footerSoon}>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={styles.footerLabel}>{FOOTER_LABELS.legal}</p>
              <ul className={styles.footerList}>
                {FOOTER_LEGAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Az évszám korábban be volt égetve ("© 2026"), miközben a Footer.tsx
              számolta — a kettő januárban szétcsúszott volna. */}
          <p className={styles.footerLegal}>
            {footerCopyright(new Date().getFullYear())}
          </p>
        </div>
      </div>
    </div>
  );
}
