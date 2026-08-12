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
    href: "/work",
    desc:
      "Projects, invoicing and client communication on a single surface. The software we built for ourselves before we ever sold it to anyone.",
  },
  {
    client: "North",
    image: "/work/helios.jpg",
    href: "/work",
    desc:
      "A budgeting app for iOS that makes money feel calm. A clear visual system, fluid native interactions, and a flow that turns everyday spending into a habit people actually keep.",
  },
  {
    client: "Miért?",
    image: "/work/miert.jpg",
    href: "/work",
    desc:
      "A podcast whose brand is the question. An editorial system, a motion language and a visual voice that sounds the same, recognizably, in every episode.",
  },
];

// Három mód, egyetlen szekció. A `diagonal` a pinelt, széles nézetű
// koreográfia; a `stacked` a telefon függőleges kártyalistája a SAJÁT
// koreográfiájával; a `static` a csökkentett mozgást kérő látogatóé, ahol
// egyik JS-effekt sem épül fel és a CSS base layout az igazság.
type Mode = "static" | "diagonal" | "stacked";

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("static");

  // Melyik mód fusson: kliens, engedélyezett mozgás ÉS elég széles viewport.
  // Mobilon (≤768px) a pinelt diagonális koreográfia összepréselődik a
  // magas-keskeny viewportben, ezért ott nem ez, hanem az egymás-alá-rakott
  // layout fut — de a 2026-08-12-i változtatás óta az sem mozdulatlan, saját
  // beatjei vannak (lásd a stacked effektet lentebb). A breakpoint átlépésére
  // (resize/forgatás) újraértékeljük.
  //
  // A `static` kezdőérték szándékos: szerveren és az első festéskor a base
  // layout érvényes, a mód csak a hidratálás után dől el.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 768px)");
    const update = () =>
      setMode(reduce.matches ? "static" : wide.matches ? "diagonal" : "stacked");
    update();
    wide.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  // Build the pin only AFTER the .isDiagonal class is committed to the DOM,
  // so ScrollTrigger measures the diagonal layout (not the stacked fallback).
  useEffect(() => {
    if (mode !== "diagonal") return;

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
      let brandExit: gsap.core.Tween | null = null;

      // Write the name back one letter at a time: split the new text into chars
      // and stagger them up into place. The previous split is reverted first so
      // the DOM is a plain text node between swaps (cleanup reverts the last one).
      const revealBrand = (text: string) => {
        if (!brandEl) return;
        brandReveal?.kill();
        brandExit?.kill();
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

      // The exact time-reverse of revealBrand: instead of fading the name out as
      // one block, the current letters drop back down and out one by one — last
      // letter first — so the name "un-writes" itself the way it was written. The
      // current split is reused (it holds the on-screen chars); if there isn't one
      // yet (very first swap shows the JSX text node) we split it on the fly.
      // Returns the exit's total time so the caller can start the new name after.
      const exitBrand = (): number => {
        if (!brandEl) return 0;
        brandReveal?.kill();
        brandExit?.kill();
        if (!brandSplit) {
          brandSplit = new SplitText(brandEl, { type: "chars" });
          gsap.set(brandSplit.chars, { display: "inline-block" });
        }
        brandExit = gsap.to(brandSplit.chars, {
          autoAlpha: 0,
          yPercent: 25,
          duration: 0.5,
          ease: "power3.in",
          stagger: { each: 0.045, from: "end" },
        });
        return brandExit.totalDuration();
      };

      // Calm, staggered change — the two labels never move in unison. The name
      // leads: it un-writes itself letter by letter (reversed entrance), then the
      // next name writes itself back in. The description follows a beat later with
      // a soft crossfade. Absolute timeline positions keep the offset independent
      // of scroll speed.
      const swapText = (active: number) => {
        const p = projects[active];
        swapTl?.kill(); // a fast scroll past two works can't stack swaps
        const tl = gsap.timeline();
        if (brandEl) {
          const exitDur = exitBrand();
          tl.add(() => revealBrand(p.client), exitDur);
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

    // This effect runs a render AFTER every other section created its triggers
    // (see the `enabled` two-step above), so our pin lands at the END of
    // ScrollTrigger's internal array. Refresh processes that array in order:
    // triggers for sections BELOW the pin (Process, Manifesto) would calculate
    // before the pin and never receive its ~2.4-viewport pin-spacer offset —
    // their animations then fire that far too early, finishing below the fold.
    // sort() reorders the array by document position so the pin calculates
    // first and everything beneath it gets compensated on the refresh.
    ScrollTrigger.sort();

    // measure again now that the diagonal layout is in place
    ScrollTrigger.refresh();

    return () => {
      brandSplit?.revert();
      ctx.revert();
    };
  }, [mode]);

  // ─── Stacked mód (telefon) koreográfiája ────────────────────────────────
  // A diagonális pin ≤768px-en ki van kapcsolva, és a helyére lépő függőleges
  // kártyalista mozdulatlan volt: az EGYETLEN néma szekció egy egyébként végig
  // görgetésre vezérelt oldalon. Nem a diagonális koreográfia portja — az pont
  // azért van kikapcsolva, mert a magas-keskeny viewportben összepréselődik —,
  // hanem a szekció saját szótára a lista formátumához igazítva:
  //
  //   (1) a fotó ALULRÓL FELFELÉ tárul fel (clip-wipe), a keret marad a helyén,
  //   (2) a név BETŰNKÉNT írja be magát — pontosan az a recept, amivel a
  //       diagonális mód is cseréli a nevet (revealBrand), tehát a két nézet
  //       ugyanazt a gesztust használja, csak más ürüggyel,
  //   (3) a leírás egy ütemmel később emelkedik be.
  //
  // IDŐZÍTETT belépők, NEM scrub-eltek — és minden elem a SAJÁT triggerén.
  // Az első verzió mindkettőt fordítva csinálta, és emiatt telefonon gyakorlatilag
  // láthatatlan volt. A két ok, külön:
  //
  //  (a) Scrub egy nem-pinelt listán = gyors pöccintésnél a belépő azonnal
  //      lefut. A Lenis a touch-ot NEM simítja (SmoothScroll.tsx: csak
  //      smoothWheel), tehát telefonon nyers, lendületes a görgetés, a `scrub: 1`
  //      pedig még egy MÁSODPERC késleltetést is rátett: mire az idővonal
  //      utolérte magát, a kártya már rég a helyén állt. A Partners azért bírja a
  //      scrubot, mert PINELT — ott 730vh scroll-budget tartja a színpadot a
  //      képernyőn. Egy szabadon elgörgő kártyalistának nincs ilyen budgetje.
  //
  //  (b) A három elem a kártyán BELÜL nagyon eltérő mélységben ül (a kép 0px, a
  //      név ~298px, a leírás ~387px a kártya tetejétől). Egyetlen, a KÁRTYA
  //      pozíciójára kötött ablakból ez azt jelentette, hogy a név a saját
  //      animációja alatt még a hajtás alatt volt: a betűk a képernyőn kívül
  //      írták be magukat. Ezért látszott CSAK a leírás — az az egy beat ért
  //      véget pont akkor, amikor a bekezdés végre a képernyőre került.
  //
  // A javítás mindkettőre ugyanaz: minden elem akkor induljon, amikor ŐMAGA lép
  // be a képbe, és utána a saját tempójában játsszon le. A kép → név → leírás
  // sorrendet így nem az idővonal tartja, hanem a függőleges elrendezés — ezek
  // ebben a sorrendben lépnek be a képernyőre, tehát ebben a sorrendben is
  // indulnak, bármilyen kártya- és viewport-magasság mellett.
  //
  // A `reverse` a toggleActions-ben megtartja a visszafelé-játszást, ami miatt
  // eredetileg a scrub mellett érveltem — csak most nem a láthatóság árán.
  useEffect(() => {
    if (mode !== "stacked") return;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    const root = rootRef.current;
    if (!root) return;

    // A ctx-en kívül, mert futásidőben készülnek: a revert() nem tartja őket
    // számon, a takarításnak kézzel kell visszaadnia a sima szövegcsomópontot.
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-page]", root);

      cards.forEach((card) => {
        const frame = card.querySelector<HTMLElement>("[data-feature]");
        const img = card.querySelector<HTMLElement>("[data-feature] img");
        const brand = card.querySelector<HTMLElement>("[data-caption-brand]");
        const desc = card.querySelector<HTMLElement>("[data-caption-desc]");

        // Folyamatos parallax a kereten BELÜL, a kártya teljes áthaladására
        // kötve. Ez az, ami a listát élővé teszi két belépő között — enélkül a
        // szekció a reveal után visszaáll mozdulatlannak.
        //
        // A skálázás nem díszítés, hanem a parallax mozgástere: az `object-fit:
        // cover` kép pontosan kitölti a keretet, tehát eltolva felül/alul kilógna
        // a háttér. 1.14 = 7% ráhagyás mindkét irányban, a ±5%-os elmozdulás
        // ezen belül marad. A kettő EGYÜTT mozog: ha a yPercent nő, a scale is
        // kell hogy nőjön.
        if (img) {
          gsap.set(img, { scale: 1.14 });
          gsap.fromTo(
            img,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        // Közös trigger-recept. A `start` mindig az ELEM saját teteje a viewport
        // alsó harmadában: elég korán ahhoz, hogy a mozdulat eleje is látszódjon,
        // elég későn ahhoz, hogy ne a képernyőn kívül induljon.
        const onEnter = (trigger: HTMLElement, start = "top 86%") => ({
          trigger,
          start,
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        });

        // (1) a fotó FENTRŐL LEFELÉ tárul fel, és korán indul.
        //
        // Az irány itt nem ízlés kérdése, hanem geometriáé. A kép 1:1, tehát egy
        // 390px széles telefonon ~350px magas, a viewport 664px — a fotó a
        // képernyő több mint felét elfoglalja, és mindig ALULRÓL úszik be. Egy
        // alulról-felfelé bomló wipe ezért a kép ALSÓ élétől indulna, ami a
        // trigger pillanatában még bőven a hajtás alatt van: a mozdulat első
        // kétharmada a képernyőn kívül futna le. Fentről lefelé viszont a wipe
        // pont azon a sávon dolgozik, amelyik már látszik.
        //
        // Ezért indul korán is (top 92%): amint a fotó felső éle megjelenik, a
        // feltárulás már megy. Későbbi triggerrel egy nagy, üres fehér doboz
        // görögne be a képbe, és csak utána kapcsolna — a clip a keret hátterét
        // (#f0f0f0) is elfedi.
        //
        // A clip a KERETEN van, nem a képen: így a parallaxot vivő <img>
        // transformja érintetlen marad, a két gesztus nem ír ugyanabba a
        // tulajdonságba.
        if (frame) {
          gsap.set(frame, { clipPath: "inset(0% 0% 100% 0%)" });
          gsap.to(frame, {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power2.out",
            duration: 1.1,
            scrollTrigger: onEnter(frame, "top 92%"),
          });
        }

        // (2) a név betűnként. A .captionBrand mix-blend-mode: difference-szel
        // fut, és a fotó aljára lóg — a betűk tehát menet közben váltanak
        // fehérből feketébe, ahogy átlépik a kép alsó élét. A tweenek a
        // KARAKTEREKEN vannak, nem a blokkon: a blend a szülőn marad, a
        // gyerekek transformja nem bontja meg a blend-kontextust.
        //
        // A trigger a NÉVEN van, nem a kártyán — ez volt az eredeti hiba lényege.
        if (brand) {
          const split = new SplitText(brand, { type: "chars" });
          splits.push(split);
          gsap.set(split.chars, { display: "inline-block" });

          // set + to, NEM from: egy stagger-elt `from` nem tartja meg a kiinduló
          // állapotot minden célponton (mérve csak az ELSŐ karakter volt rejtve,
          // a maradék öt teljes fedettséggel állt, majd újraanimálta magát). A
          // kiinduló állapotot ezért kézzel írjuk ki — ugyanaz a recept, mint a
          // Partners lineTwo-jánál.
          gsap.set(split.chars, { yPercent: 45, autoAlpha: 0 });
          gsap.to(split.chars, {
            yPercent: 0,
            autoAlpha: 1,
            ease: "power3.out",
            stagger: 0.055,
            duration: 0.55,
            // 80%, nem 90%: a névnek a saját animációja alatt LÁTSZANIA kell.
            // 90%-nál a felirat a képernyő legalsó sávjában írná be magát,
            // vagyis megismételné az eredeti hibát, csak kisebb léptékben.
            scrollTrigger: onEnter(brand, "top 80%"),
          });
        }

        // (3) a leírás. Külön triggeren, de a névnél valamivel későbbi
        // belépéssel: a kártya sorrendje (kép → név → szöveg) így olvasási
        // sorrend is lesz, és mivel a leírás fizikailag a név ALATT van, magától
        // is később ér a képbe — a kettő egymást erősíti.
        if (desc) {
          gsap.set(desc, { y: 20, autoAlpha: 0 });
          gsap.to(desc, {
            y: 0,
            autoAlpha: 1,
            ease: "power2.out",
            duration: 0.7,
            scrollTrigger: onEnter(desc, "top 85%"),
          });
        }
      });

      // A záró CTA ugyanazzal az emelkedéssel érkezik, mint a leírások — a
      // lista végpontja, nem külön gesztus. Ugyanaz az időzített recept.
      const cta = root.querySelector<HTMLElement>("[data-stacked-cta]");
      if (cta) {
        gsap.set(cta, { y: 20, autoAlpha: 0 });
        gsap.to(cta, {
          y: 0,
          autoAlpha: 1,
          ease: "power2.out",
          duration: 0.7,
          scrollTrigger: {
            trigger: cta,
            start: "top 90%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      }
    }, root);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, [mode]);

  return (
    <section
      ref={rootRef}
      className={`${styles.work} ${mode === "diagonal" ? styles.isDiagonal : ""}`}
      id="work"
    >
      <div ref={stageRef} className={styles.stage}>
        <div ref={trackRef} className={styles.track}>
          {projects.map((p, i) => (
            <Link
              key={p.client}
              href={p.href}
              className={styles.page}
              data-page
              data-cursor-text="View case"
              style={{ "--i": i } as CSSProperties}
            >
              <div className={styles.inner} data-inner>
                <div className={styles.feature} data-feature>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.client} className={styles.featureImg} />
                </div>
              </div>
              {/* Statikus (mobil / reduced-motion) nézet felirata — diagonális
                  módban elrejtve, ott a swap-elő .brand/.copy viszi a szöveget.
                  A data-* horgokra a stacked mód koreográfiája épül. */}
              <div className={styles.caption}>
                <h3 className={styles.captionBrand} data-caption-brand>
                  {p.client}
                </h3>
                <p className={styles.captionDesc} data-caption-desc>
                  {p.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Csak a statikus (stacked) nézetben: a diagonális mód a cornerCta-t
            használja a saját pinelt sarkában. */}
        <div className={styles.stackedCta} data-stacked-cta>
          <SplashLink href="/work" className={styles.cornerCtaLink}>
            <CtaSwap defaultLabel="All our work ↗" hoverLabel="Let's see ↗" />
          </SplashLink>
        </div>

        <p className={styles.copy} data-copy>
          {projects[0].desc}
        </p>

        <h3 className={styles.brand} data-brand>
          {projects[0].client}
        </h3>

        <div className={styles.cornerCta} data-corner-cta>
          <SplashLink href="/work" className={styles.cornerCtaLink}>
            <CtaSwap defaultLabel="All our work ↗" hoverLabel="Let's see ↗" />
          </SplashLink>
        </div>
      </div>
    </section>
  );
}
