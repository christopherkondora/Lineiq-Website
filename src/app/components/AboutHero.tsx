"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./AboutHero.module.css";
import type { Dictionary } from "../i18n/dictionary";

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

// Two sets of breaks, because a break is set for a measure and there are two
// measures here. Below 600px the wide set's lines are longer than the screen,
// and the browser's own wrapping put "the" alone on a line and then broke
// "brands worth building." across two more. Both sets ship and CSS picks one;
// display:none also keeps the unused set out of the accessibility tree.
//
// The sets are strings rather than markup so the breaks are legible as breaks.
// They are in the dictionary (about.hero), with the word whose hyphen is the
// red mark; renderLine puts the red hyphen back wherever that word appears.
function renderLine(text: string, hyphenated: string) {
  const at = text.indexOf(hyphenated);
  const dash = hyphenated.indexOf("-");
  if (at === -1 || dash === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      {hyphenated.slice(0, dash)}
      <span className={styles.hyphen}>-</span>
      {hyphenated.slice(dash + 1)}
      {text.slice(at + hyphenated.length)}
    </>
  );
}

function LineSet({
  lines,
  hyphenated,
  className,
}: {
  lines: string[];
  hyphenated: string;
  className: string;
}) {
  return (
    <span className={className}>
      {lines.map((line) => (
        <span key={line} className={styles.headLine} data-hero-line>
          <span>{renderLine(line, hyphenated)}</span>
        </span>
      ))}
    </span>
  );
}

// useLayoutEffect runs before paint, which is the point: a plain useEffect fires
// after the browser has already painted the finished heading, so the first frame
// shows the type in place and the second snaps it back down to start its rise.
// With four elements moving that was camouflaged; with one line of type on an
// otherwise empty screen it is the first thing you see. React warns on
// useLayoutEffect during SSR, hence the guard.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AboutHero({
  t,
}: {
  t: Dictionary["about"]["hero"];
}) {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Only the set CSS is actually showing. offsetParent is null for anything
      // inside a display:none subtree, which reads the stylesheet's decision
      // rather than restating the breakpoint here — and without the filter the
      // stagger would count the hidden set's lines and delay the visible ones.
      const lines = gsap.utils
        .toArray<HTMLElement>("[data-hero-line] > span", root)
        .filter((el) => el.offsetParent !== null);

      // yPercent 135, not 115: .headLine carries padding-bottom so the tightened
      // leading cannot clip the descender, which makes the mask taller than the
      // line it hides. 100% no longer clears the bottom edge.
      gsap.from(lines, {
        yPercent: 135,
        duration: 1.1,
        stagger: 0.14,
        delay: 0.1,
        ease: "power3.out",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.hero} id="about-hero">
      <div className={`container ${styles.inner}`}>
        <h1 className={`text-hero ${styles.heading}`}>
          <LineSet
            lines={t.wideLines}
            hyphenated={t.hyphenated}
            className={styles.linesWide}
          />
          <LineSet
            lines={t.narrowLines}
            hyphenated={t.hyphenated}
            className={styles.linesNarrow}
          />
        </h1>
      </div>
    </section>
  );
}
