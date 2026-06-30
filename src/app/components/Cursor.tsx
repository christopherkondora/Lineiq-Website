"use client";

import { useEffect, useRef } from "react";

// LineiQ saját kurzor. A függőleges ecsetvonás kettős szerepű: egyszerre
// szövegkurzor-érzetű I-beam és a "LineiQ" I-betűje (apró branding). Kattintható
// felület fölött vízszintes szár rajzolódik be a középvonalból kifelé, így a vonás
// + jellé alakul (interakció-jelzés). A mark nyers, kézzel rajzolt ecsetvonás.
// A line mindig látszik; a plus overlay ugyanarra a középre ül, és clip-path-szal
// "behúzza" a vízszintes szárat. A hover-váltás tisztán CSS :has(), a követés JS
// translate. A mark a vízszintes egérsebesség arányában megdől (max ±70°), majd
// lerp-pel visszaáll 0-ra — így a vonás "beledől" a mozgásba.
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) {
      document.documentElement.classList.add("no-cursor");
      return;
    }

    const root = rootRef.current;
    const mark = markRef.current;
    if (!root || !mark) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    mark.style.transformOrigin = "50% 50%";

    let current = 0; // aktuális szög
    let target = 0; // cél szög (sebességből)
    let lastX = 0;
    let lastT = performance.now();
    let revealed = false;

    const onMove = (e: MouseEvent) => {
      // a -50% középre teszi a sized .cursor dobozt a kurzor-pontra (hotspot)
      root.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      if (!revealed) {
        revealed = true;
        root.classList.add("is-visible");
      }
      if (reduce) return;

      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const vx = (e.clientX - lastX) / dt; // px / ms
        target = Math.max(Math.min(vx * 50, 70), -70);
      }
      lastX = e.clientX;
      lastT = now;
    };

    let raf = 0;
    const tick = () => {
      if (!reduce) {
        current += (target - current) * 0.07;
        target += (0 - target) * 0.03;
        mark.style.transform = `rotate(${current}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <div ref={markRef} className="cursor-mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cursor-line" src="/cursor/cursor-line.svg" alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cursor-plus" src="/cursor/cursor-plus.svg" alt="" />
      </div>
    </div>
  );
}
