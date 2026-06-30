"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Process.module.css";
import { services } from "../data/services";

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);

  // The home page parks this section sticky while the Manifesto rises over it
  // (page.module.css .stackSticky). The sticky wrapper needs its own rendered
  // height as --stack-sticky-h so it can park bottom-aligned to the viewport;
  // CSS alone can't reference an element's own height. Runs regardless of
  // reduced motion — this is positioning, not animation.
  useEffect(() => {
    const sticky = rootRef.current?.parentElement;
    if (!sticky) return;
    const ro = new ResizeObserver(() => {
      sticky.style.setProperty("--stack-sticky-h", `${sticky.offsetHeight}px`);
    });
    ro.observe(sticky);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
          // clear inline props once in place so the CSS hover states (which
          // drive opacity/transform) aren't overridden by GSAP's leftover inline
          // styles.
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );

      // One trigger on the list so the rows read as a single staggered sequence.
      gsap.fromTo(
        root.querySelectorAll("[data-row]"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: root.querySelector("[data-list]"), start: "top 80%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={`section ${styles.process}`} id="services">
      <div className="container">
        <header className={styles.head}>
          <h2 className={`text-section ${styles.title}`} data-reveal>
            From strategy to code.
          </h2>
        </header>

        <ul className={styles.list} data-list>
          {services.map((s, i) => (
            <li key={s.slug} className={styles.rowItem} data-row>
              <Link href={`/services/${s.slug}`} className={styles.row}>
                <span className={styles.num}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={styles.main}>
                  <h3 className={styles.serviceTitle}>{s.title}</h3>
                  <div className={styles.bodyWrap}>
                    <p className={styles.teaser}>
                      {s.teaser.join(" · ")}
                      <span className={styles.etc}> · etc.</span>
                    </p>
                  </div>
                </div>
                <span className={styles.essence}>{s.essence}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
