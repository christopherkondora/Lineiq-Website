"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SplashLink from "./SplashLink";
import CtaSwap from "./CtaSwap";
import styles from "./SequenceSection.module.css";

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

    frames.current = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = () => { if (i === 0) drawFrame(0); };
      return img;
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
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper} data-dark data-always-header>
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} />

        <div ref={endTextRef} className={styles.endText}>
          <p className={styles.endHeadline}>Készen állsz?</p>
          <SplashLink href="/kapcsolat" className={styles.endCta}>
            <CtaSwap defaultLabel="Kezdjük el." hoverLabel="Vágjunk bele!" />
          </SplashLink>
        </div>

        <div className={styles.footerOverlay}>
          <div className={styles.footerGrid}>
            <div>
              <p className={styles.footerLabel}>Stúdió</p>
              <p className={styles.footerText}>LineiQ Kft.<br />Budapest, HU</p>
            </div>
            <div>
              <p className={styles.footerLabel}>Oldaltérkép</p>
              <ul className={styles.footerList}>
                <li><Link href="/munkaink">Munkáink</Link></li>
                <li><Link href="/mit-nyujtunk">Mit nyújtunk?</Link></li>
                <li><Link href="/rolunk">Rólunk</Link></li>
                <li><Link href="/kapcsolat">Kapcsolat</Link></li>
              </ul>
            </div>
            <div>
              <p className={styles.footerLabel}>Közösség</p>
              <ul className={styles.footerList}>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">Are.na</a></li>
              </ul>
            </div>
            <div>
              <p className={styles.footerLabel}>Ökoszisztéma</p>
              <ul className={styles.footerList}>
                <li><a href="#">Klient</a></li>
                <li><a href="#">Miért? — Podcast</a></li>
                <li><a href="#">Kova — Tanfolyam</a></li>
              </ul>
            </div>
          </div>
          <p className={styles.footerLegal}>© 2026 LineiQ. Minden jog fenntartva.</p>
        </div>
      </div>
    </div>
  );
}
