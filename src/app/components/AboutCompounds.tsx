"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutCompounds.module.css";

// The Ism, given its own viewport. It used to sit at the bottom of AboutOrigin
// as a pull-quote with a red rule under it; the rule's whole job was separating
// it from the prose around it, and there is no prose around it any more.
//
// The section performs its own claim. Everything except the word "compounds"
// fades away, and that word travels to centre, travels up, and grows, all as one
// motion, until it spans the viewport. It hits full width already on its way off
// the top edge, so when the pin releases the word is *already* moving upward and
// the hand-off to ordinary page scroll has no seam in it.
//
// Centring is not decoration: "compounds" ends its sentence well right of
// centre, so scaling it in place would push it off the right edge long before it
// reached full width.

// Share of the viewport the word spans at full size. Not 1: the tracking is
// negative, so the layout box is one letter-space narrower than the ink it
// holds, and the "c" carries a negative left bearing on top of that. Measured,
// a box set to exactly 100% put ~8px of ink outside itself and the outer
// strokes of the c and the s were shaved off against the screen edges. The
// margin also absorbs the same effect coming out a different size in another
// engine, which matters because the phone this is for is not this one.
const FILL = 0.98;
// Share of the word's own height that sits above the viewport at full size. The
// reader has already read the word by then, so this is tuned by how the motion
// feels rather than by whether the word is still legible.
const EXIT_CROP = 0.3;
// Scroll consumed by the pin, in viewports.
const PIN_VH = 1.5;
// Share of the scrub spent fading the surrounding words.
const FADE_SHARE = 0.28;
// Share of the scrub spent growing. The rest is the exit. Two beats rather than
// one: the word finishes at full width, standing still and whole, and only then
// lifts. Measured, the single-motion version reached full width at the exact
// frame it crossed the top edge — 42px of a 99px word already gone on a phone —
// so the size the whole section is built around was never actually seen.
const GROW_SHARE = 0.68;
// Share of the exit travel spent before the growth is finished. Without it the
// word held perfectly still and then set off, and a standing start reads as a
// jolt however smooth each half is on its own. It now creeps upward under the
// last of the growth — about 60px on a phone — so the exit is a change of pace
// rather than a change of state.
const DRIFT_SHARE = 0.15;

// The phone used to run an unpinned variant: one viewport, no pin, and ordinary
// page scroll supplying the upward travel. It was built that way to dodge the
// iOS address bar, and the cost was that the word was already leaving while it
// was still growing — you never saw it at full width standing still. It now
// runs the same pinned motion as the desktop. The address bar is survivable
// because ScrollTrigger pins by transform rather than position:fixed on touch,
// and because the resize handler below ignores height-only changes, which is
// exactly what an address bar collapse looks like.
type Mode = "static" | "pinned";

// useLayoutEffect so the measured position of the display copy is committed
// before paint; with a plain useEffect the unpositioned word flashes.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AboutCompounds() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLSpanElement>(null);
  const bigRef = useRef<HTMLSpanElement>(null);

  // "static" on the server and at first paint, exactly as Work.tsx does it: the
  // base layout is what renders, and the mode only resolves after hydration.
  const [mode, setMode] = useState<Mode>("static");
  // Bumped on width changes so the measured geometry is rebuilt. Width only:
  // mobile browsers fire resize every time the address bar collapses, and
  // rebuilding on that would thrash the pin.
  const [measureKey, setMeasureKey] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMode(reduce.matches ? "static" : "pinned");
    update();
    reduce.addEventListener("change", update);
    return () => reduce.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastWidth = window.innerWidth;
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(t);
      t = setTimeout(() => setMeasureKey((k) => k + 1), 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (mode === "static") return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    const stage = stageRef.current;
    const inline = inlineRef.current;
    const big = bigRef.current;
    if (!root || !stage || !inline || !big) return;

    const ctx = gsap.context(() => {
      // The display copy is rendered at its FINAL size and scrubbed *down* to
      // meet the sentence, never up. Text is rasterised once at its layout size
      // and the GPU stretches that bitmap, so scaling type up is soft (reliably
      // so in Safari, and will-change locks the layer). Scaling down is crisp at
      // every step. It also means opsz is correct for free, because the element
      // genuinely is set at display size.
      gsap.set(big, { clearProps: "transform", fontSize: "" });
      const probe = 100;
      big.style.fontSize = `${probe}px`;
      const probeWidth = big.getBoundingClientRect().width;
      if (!probeWidth) return;
      // clientWidth, not innerWidth: innerWidth counts the scrollbar, so the
      // word would end up wider than the space it is supposed to span and get
      // clipped at both edges exactly when it lands.
      const viewport = document.documentElement.clientWidth;
      const finalSize = probe * ((viewport * FILL) / probeWidth);
      big.style.fontSize = `${finalSize}px`;

      const stageRect = stage.getBoundingClientRect();
      const inlineRect = inline.getBoundingClientRect();
      const bigRect = big.getBoundingClientRect();
      if (!bigRect.width || !inlineRect.width) return;

      // Everything is expressed as an offset from where the display copy
      // naturally sits, because transform-origin is its centre: scaling alone
      // leaves that centre put, so x/y only ever has to move centre to centre.
      const centre = (r: DOMRect) => ({
        x: r.left - stageRect.left + r.width / 2,
        y: r.top - stageRect.top + r.height / 2,
      });
      const inlineC = centre(inlineRect);
      const bigC = centre(bigRect);

      const startScale = inlineRect.width / bigRect.width;
      const start = { x: inlineC.x - bigC.x, y: inlineC.y - bigC.y };
      // Centred on the viewport, not on the stage. The stage is measured before
      // ScrollTrigger inserts its pin spacer, and that shifts it a few px — with
      // the word sized to exactly the viewport width there is no tolerance for
      // that, and it was landing 7px left, clipping the c and the s. Horizontal
      // position does not move when the pin engages, so viewport coordinates are
      // both simpler and the frame the word is actually sized against.
      const endX = viewport / 2 - (bigRect.left + bigRect.width / 2);
      // Full size, with EXIT_CROP of the word's height already above the top
      // edge: centre sits at (0.5 - EXIT_CROP) of its own height from the top.
      const endY = (0.5 - EXIT_CROP) * bigRect.height - bigC.y;

      // Hand over from the inline word to the display copy before paint. The
      // inline word keeps its space at opacity 0 so the sentence never reflows,
      // and stays in the accessibility tree.
      gsap.set(inline, { opacity: 0 });
      gsap.set(big, {
        x: start.x,
        y: start.y,
        scale: startScale,
        autoAlpha: 1,
      });

      const fades = gsap.utils.toArray<HTMLElement>("[data-fade]", root);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + window.innerHeight * PIN_VH,
          // scrub:true rather than a lag value, and no anticipatePin, for the
          // reasons Work.tsx spells out: Lenis already smooths scroll position
          // globally, so a second smoothing pass here collapses responsiveness
          // right at the seam.
          scrub: true,
          pin: stage,
          invalidateOnRefresh: true,
        },
      });

      tl.to(fades, { opacity: 0, ease: "none", duration: FADE_SHARE }, 0);

      // Beat one: to centre, and up to full width, with y left alone. Growth and
      // fade both run from the start, so on a linear curve the word is already
      // ~18% larger while "thing that" is only a third faded and it ploughs
      // through the words it is replacing. inOut, not in: the slow head still
      // holds it back until the sentence has cleared, and the slow tail lands it
      // at full width rather than slamming into it.
      tl.to(
        big,
        { x: endX, scale: 1, ease: "power2.inOut", duration: GROW_SHARE },
        0
      );

      // The creep. Starts once the sentence has gone, from a standstill, and
      // accelerates — so at the moment the growth ends the word is already
      // moving and there is nothing to start.
      tl.to(
        big,
        {
          y: start.y + (endY - start.y) * DRIFT_SHARE,
          ease: "power2.in",
          duration: GROW_SHARE - FADE_SHARE,
        },
        FADE_SHARE
      );

      // Beat two: the exit, and it is linear on purpose. The travel is about the
      // same distance as the scroll that drives it, so at constant speed the
      // word rises at very nearly the speed of the page — which means when the
      // pin lets go, nothing changes. That seam is the whole reason this motion
      // was built as one gesture in the first place; sequencing keeps it closed
      // as long as the last beat is the one still moving at the release.
      tl.to(big, { y: endY, ease: "none", duration: 1 - GROW_SHARE }, GROW_SHARE);
    }, root);

    return () => ctx.revert();
  }, [mode, measureKey]);

  return (
    <section
      ref={rootRef}
      className={`section--dark ${styles.compounds}`}
      id="compounds"
    >
      <div ref={stageRef} className={styles.stage}>
        <div className={`container ${styles.inner}`}>
          <p className={`text-statement ${styles.sentences}`}>
            <span data-fade>Most marketing is a tax.</span>
            <br />
            <span data-fade>Brand is the only thing that </span>
            <span ref={inlineRef} className={styles.inlineWord}>
              compounds
            </span>
            <span data-fade>.</span>
          </p>

          {/* The display copy: same face, weight, tracking and opsz as the
              sentence, so the growth is a pure scale of one letterform rather
              than a swap between two. Hidden until measured. */}
          <span
            ref={bigRef}
            className={`text-statement ${styles.big}`}
            aria-hidden="true"
          >
            compounds
          </span>
        </div>
      </div>
    </section>
  );
}
