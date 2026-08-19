"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./AboutHero.module.css";

// The page's entry moment: the Mission from Positioning.md, alone on a full
// white viewport. The label, the lede and the drawn red rule all came out. The
// statement was restating itself three ways; now it carries the fold by itself.
//
// The lines are masked and rise on load, not on scroll: this sits above the
// fold, so a ScrollTrigger would either fire instantly or never.
//
// The one red mark is the hyphen in "short-termism". It is a line, which is the
// brand's own gesture, and it sits inside the word for the thing the studio
// exists to end.

// useLayoutEffect runs before paint, which is the point: a plain useEffect fires
// after the browser has already painted the finished heading, so the first frame
// shows the type in place and the second snaps it back down to start its rise.
// With four elements moving that was camouflaged; with one line of type on an
// otherwise empty screen it is the first thing you see. React warns on
// useLayoutEffect during SSR, hence the guard.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // yPercent 135, not 115: .headLine carries padding-bottom so the tightened
      // leading cannot clip the descender, which makes the mask taller than the
      // line it hides. 100% no longer clears the bottom edge.
      gsap.from(
        "[data-hero-line] > span",
        {
          yPercent: 135,
          duration: 1.1,
          stagger: 0.14,
          delay: 0.1,
          ease: "power3.out",
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.hero} id="about-hero">
      <div className={`container ${styles.inner}`}>
        <h1 className={`text-hero ${styles.heading}`}>
          <span className={styles.headLine} data-hero-line>
            <span>We exist to end</span>
          </span>
          <span className={styles.headLine} data-hero-line>
            <span>
              short<span className={styles.hyphen}>-</span>termism in the
            </span>
          </span>
          <span className={styles.headLine} data-hero-line>
            <span>brands worth building.</span>
          </span>
        </h1>
      </div>
    </section>
  );
}
