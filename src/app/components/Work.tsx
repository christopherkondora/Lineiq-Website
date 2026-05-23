"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Work.module.css";
import SplashLink from "./SplashLink";

const projects = [
  {
    n: "01",
    client: "Klient",
    title: "Ügynökségi operációs rendszer",
    year: "2025",
    tags: ["SaaS", "Termék", "Brand"],
    image: "/work/klient.jpg",
  },
  {
    n: "02",
    client: "Helios Clinic",
    title: "Brand és foglalórendszer",
    year: "2025",
    tags: ["Egészségügy", "Identitás", "Web"],
    image: "/work/helios.jpg",
  },
  {
    n: "03",
    client: "Miért?",
    title: "Editorial brand egy podcastnek",
    year: "2026",
    tags: ["Média", "Editorial", "Motion"],
    image: "/work/miert.jpg",
  },
];

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    const floater = floatRef.current;
    const img = imgRef.current;
    if (!root || !floater || !img) return;

    const isTouch = window.matchMedia("(hover: none)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.querySelectorAll("[data-reveal]"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );

      root.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
        gsap.fromTo(
          row,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 85%" },
          }
        );
      });
    }, root);

    if (isTouch) return () => ctx.revert();

    let active = false;
    const xTo = gsap.quickTo(floater, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(floater, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      if (!active) return;
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const rows = root.querySelectorAll<HTMLElement>("[data-row]");
    const enterFns: Array<() => void> = [];
    rows.forEach((row) => {
      const src = row.dataset.image;
      const onEnter = (e: globalThis.MouseEvent) => {
        active = true;
        if (src) img.src = src;
        gsap.set(floater, { x: e.clientX, y: e.clientY });
        gsap.to(floater, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        });
      };
      const onLeave = () => {
        active = false;
        gsap.to(floater, {
          opacity: 0,
          scale: 0.92,
          duration: 0.3,
          ease: "power3.out",
        });
      };
      row.addEventListener("mouseenter", onEnter);
      row.addEventListener("mouseleave", onLeave);
      enterFns.push(() => {
        row.removeEventListener("mouseenter", onEnter);
        row.removeEventListener("mouseleave", onLeave);
      });
    });

    window.addEventListener("mousemove", onMove);
    gsap.set(floater, {
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      scale: 0.92,
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      enterFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className={`section ${styles.work}`} id="munkak">
      <div className="container">
        <header className={styles.head}>
          <p className="text-label" data-reveal>
            ◆ 02 — Kiemelt munkák
          </p>
          <h2 className={`text-section ${styles.title}`} data-reveal>
            Munkák, amikre
            <br />
            <em className={styles.italic}>ráírtuk a nevünk.</em>
          </h2>
        </header>

        <ul className={styles.list}>
          {projects.map((p) => (
            <li
              key={p.n}
              className={styles.row}
              data-row
              data-image={p.image}
              data-cursor-text="Case megnézése"
            >
              <span className={styles.num}>{p.n}</span>
              <div className={styles.titleCol}>
                <h3 className={styles.projectTitle}>{p.client}</h3>
                <p className={styles.projectSub}>{p.title}</p>
              </div>
              <ul className={styles.tags}>
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <span className={styles.year}>{p.year}</span>
            </li>
          ))}
        </ul>

        <div className={styles.cta} data-reveal>
          <SplashLink
            href="/munkaink"
            className="btn-secondary"
            cursorText="Összes munka"
          >
            <span className="btn-label">Összes munkánk ↗</span>
          </SplashLink>
        </div>
      </div>

      <div ref={floatRef} className={styles.floater} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="/work/klient.jpg"
          alt=""
          className={styles.floaterImg}
        />
      </div>
    </section>
  );
}
