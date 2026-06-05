"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./Work.module.css";
import SplashLink from "./SplashLink";
import CtaSwap from "./CtaSwap";

// Diagonal step per page. MUST stay in sync with --stepx / --stepy in the CSS.
// Low X / high Y = a near-vertical path: images rise and exit the top rather
// than drifting into the top-left corner, and the high Y clears them fully
// off-screen between works (see reference site).
const STEP_X = 0.27; // 27vw
const STEP_Y = 0.72; // 72vh
// Scroll length (in viewport-heights) per page-step. Higher = slower.
const SCROLL_PER_STEP = 1.35;

// Intro/outro image slides in ALONG the diagonal scroll axis — same x/y ratio
// as STEP_X/STEP_Y, so there is no angle break at the seam. ENTRY_STEPS scales
// only the DISTANCE (not the angle): ~1 step keeps the entrance snappy so the
// focal image carries momentum into the pin instead of crawling. Magnitude and
// angle are independent — tune this without disturbing the matched angle.
const ENTRY_STEPS = 1.04;
const ENTRY_X = STEP_X * ENTRY_STEPS; // 0.281 vw
const ENTRY_Y = STEP_Y * ENTRY_STEPS; // 0.749 vh

const projects = [
  {
    client: "Klient",
    image: "/work/klient.jpg",
    href: "/munkaink",
    desc:
      "Projektek, számlázás és ügyfélkommunikáció egyetlen felületen. A szoftver, amit előbb építettünk magunknak, mint hogy eladtuk volna bárkinek.",
  },
  {
    client: "Helios Clinic",
    image: "/work/helios.jpg",
    href: "/munkaink",
    desc:
      "Magánklinika, ami nem úgy néz ki, mint a többi. Új identitás, új hang, és egy foglalórendszer, ami az első kattintástól a visszahívásig vezet.",
  },
  {
    client: "Miért?",
    image: "/work/miert.jpg",
    href: "/munkaink",
    desc:
      "Podcast, aminek a kérdés a márkája. Editorial rendszer, mozgókép-nyelv és egy vizuális hang, ami minden epizódban ugyanúgy, felismerhetően szól.",
  },
];

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Decide whether to run the diagonal build (client + motion allowed).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  // Build the pin only AFTER the .isDiagonal class is committed to the DOM,
  // so ScrollTrigger measures the diagonal layout (not the stacked fallback).
  useEffect(() => {
    if (!enabled) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    const root = rootRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!root || !stage || !track) return;

    // lifted out of the context so the cleanup can restore the plain text node
    // (a SplitText made at runtime inside a callback isn't tracked by ctx)
    let brandSplit: SplitText | null = null;

    const ctx = gsap.context(() => {
      const pages = gsap.utils.toArray<HTMLElement>("[data-page]", track);
      const brandEl = root.querySelector<HTMLElement>("[data-brand]");
      const copyEl = root.querySelector<HTMLElement>("[data-copy]");
      const n = pages.length;
      let lastActive = 0; // text already shows project 0 — don't swap on load
      let swapTl: gsap.core.Timeline | null = null;
      let brandReveal: gsap.core.Tween | null = null;

      // Write the name back one letter at a time: split the new text into chars
      // and stagger them up into place. The previous split is reverted first so
      // the DOM is a plain text node between swaps (cleanup reverts the last one).
      const revealBrand = (text: string) => {
        if (!brandEl) return;
        brandReveal?.kill();
        brandSplit?.revert();
        brandEl.textContent = text;
        gsap.set(brandEl, { autoAlpha: 1 });
        brandSplit = new SplitText(brandEl, { type: "chars" });
        gsap.set(brandSplit.chars, { display: "inline-block" });
        brandReveal = gsap.from(brandSplit.chars, {
          autoAlpha: 0,
          yPercent: 25,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.045,
        });
      };

      // Calm, staggered change — the two labels never move in unison. The name
      // leads: it fades out, then writes itself back letter by letter. The
      // description follows a beat later with a soft crossfade. Absolute
      // timeline positions keep the offset independent of scroll speed.
      const swapText = (active: number) => {
        const p = projects[active];
        swapTl?.kill(); // a fast scroll past two works can't stack swaps
        const tl = gsap.timeline();
        if (brandEl) {
          tl.to(brandEl, { autoAlpha: 0, duration: 0.22, ease: "power2.in" }, 0)
            .add(() => revealBrand(p.client), 0.22);
        }
        if (copyEl) {
          tl.to(copyEl, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0.18)
            .add(() => {
              copyEl.textContent = p.desc;
            }, 0.48)
            .to(copyEl, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.48);
        }
        swapTl = tl;
      };

      const paint = (progress: number) => {
        const center = progress * (n - 1);
        const active = gsap.utils.clamp(0, n - 1, Math.round(center));
        pages.forEach((pg, i) => {
          const dim = gsap.utils.clamp(0, 1, Math.abs(i - center));
          pg.style.setProperty("--dim", dim.toFixed(3));
          pg.dataset.active = String(i === active);
        });
        // brand and description no longer fade with scroll — they stay put and
        // fully visible; their change is handled by the staggered crossfade in
        // swapText() when the centered work changes
        if (active !== lastActive) {
          lastActive = active;
          swapText(active);
        }
      };
      paint(0);

      // Intro: while the section is still approaching (its top travels from the
      // bottom of the viewport up to the pin point), the first image is already
      // sliding in along the diagonal and the brand/description rise into place.
      // This makes arriving into the pinned diagonal continuous, not a hard cut.
      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      // The image tween must END the timeline (at "top top") so it lands exactly
      // as the pin/diagonal begins — no trailing plain-scroll gap.
      // The brand/copy FADE also finishes by the seam, because once pinned,
      // paint() owns their opacity (off=0 → opacity 1 at the centered work); a
      // fade that ended later would jump-fight paint. Only the *fade* lives here.
      if (brandEl) {
        intro.from(brandEl, { autoAlpha: 0, duration: 0.6, ease: "none" }, 0.15);
      }
      if (copyEl) {
        intro.from(copyEl, { autoAlpha: 0, duration: 0.45, ease: "none" }, 0.45);
      }
      const firstInner = pages[0].querySelector<HTMLElement>("[data-inner]");
      intro.from(
        firstInner,
        {
          x: () => window.innerWidth * ENTRY_X,
          y: () => window.innerHeight * ENTRY_Y,
          duration: 1,
          ease: "none",
        },
        0
      );

      // Positional settle of brand/copy — decoupled from the intro and run on a
      // LONGER range (1.3vh) so the seam (top top, at 1.0vh) sits ~77% through.
      // Linear ease is deliberate: with no front-loading the labels are still
      // visibly *moving* as the pin engages and come to rest a beat AFTER it —
      // so the entrance never lands on the seam. It only animates transform, so
      // it never collides with paint()'s opacity writes during the pin.
      const settle = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: () => "+=" + window.innerHeight * 1.3,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      // name: slow + long, resolves ~0.3vh into the pin — a smooth settle.
      if (brandEl) {
        settle.from(brandEl, { y: 90, duration: 0.55, ease: "none" }, 0.45);
      }
      // description: quicker, and drifts in diagonally toward the bottom-left
      // (starts up-right → moves down + left), resolving ~0.15vh into the pin.
      if (copyEl) {
        settle.from(copyEl, { x: 44, y: -40, duration: 0.3, ease: "none" }, 0.58);
      }

      const pinTween = gsap.to(track, {
        x: () => -window.innerWidth * STEP_X * (n - 1),
        y: () => -window.innerHeight * STEP_Y * (n - 1),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + window.innerHeight * (n - 1) * SCROLL_PER_STEP,
          // scrub:true (not a lag value) — Lenis already smooths the scroll
          // position globally; an extra scrub lag here double-smooths only the
          // pinned range, so responsiveness collapses right at the seam and
          // reads as a harsh stop. Matching the intro/outro (scrub:true) keeps
          // the hand-off into the pin continuous.
          scrub: true,
          pin: stage,
          // No anticipatePin: it shifts the pin point based on scroll velocity
          // to pre-empt fast-scroll jumps, but Lenis already smooths velocity,
          // so the prediction misfires and snaps `stage` into position a few px
          // off at engagement — the "pop / feels like a refresh" at the seam.
          invalidateOnRefresh: true,
          onUpdate: (self) => paint(self.progress),
        },
      });

      // Outro: the mirror of the intro. As the section departs (right after the
      // pin releases) the last image keeps sliding out along the diagonal and the
      // brand/description animate out upward — so the hand-off back to normal
      // scroll is as smooth as the one coming in.
      const pinST = pinTween.scrollTrigger;
      const lastInner = pages[n - 1].querySelector<HTMLElement>("[data-inner]");
      const ctaEl = root.querySelector<HTMLElement>("[data-corner-cta]");
      const outro = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: () => (pinST ? pinST.end : 0),
          end: () => (pinST ? pinST.end : 0) + window.innerHeight,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      outro.to(
        lastInner,
        {
          x: () => -window.innerWidth * ENTRY_X,
          y: () => -window.innerHeight * ENTRY_Y,
          duration: 1,
          ease: "none",
        },
        0
      );
      if (copyEl) {
        outro.to(copyEl, { y: -40, autoAlpha: 0, duration: 0.6, ease: "none" }, 0.1);
      }
      if (brandEl) {
        outro.to(brandEl, { y: -90, autoAlpha: 0, duration: 0.6, ease: "none" }, 0.25);
      }
      // The corner CTA leaves with the same upward fade as the labels, so the
      // whole stage clears together when the pin releases instead of the button
      // popping out abruptly.
      if (ctaEl) {
        outro.to(ctaEl, { y: -40, autoAlpha: 0, duration: 0.6, ease: "none" }, 0.15);
      }
    }, root);

    // measure again now that the diagonal layout is in place
    ScrollTrigger.refresh();

    return () => {
      brandSplit?.revert();
      ctx.revert();
    };
  }, [enabled]);

  return (
    <section
      ref={rootRef}
      className={`${styles.work} ${enabled ? styles.isDiagonal : ""}`}
      id="munkak"
    >
      <div ref={stageRef} className={styles.stage}>
        <div ref={trackRef} className={styles.track}>
          {projects.map((p, i) => (
            <Link
              key={p.client}
              href={p.href}
              className={styles.page}
              data-page
              data-cursor-text="Case megnézése"
              style={{ "--i": i } as CSSProperties}
            >
              <div className={styles.inner} data-inner>
                <div className={styles.feature}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.client} className={styles.featureImg} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className={styles.copy} data-copy>
          {projects[0].desc}
        </p>

        <h3 className={styles.brand} data-brand>
          {projects[0].client}
        </h3>

        <div className={styles.cornerCta} data-corner-cta>
          <SplashLink href="/munkaink" className={styles.cornerCtaLink}>
            <CtaSwap defaultLabel="Összes munkánk ↗" hoverLabel="Nézzük meg! ↗" />
          </SplashLink>
        </div>
      </div>
    </section>
  );
}
