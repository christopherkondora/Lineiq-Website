"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BookshelfSection.module.css";

interface BookData {
  title: string;
  author: string;
  spineColor: string;
  spineTextColor: string;
  coverColor: string;
  coverTextColor: string;
  height: number;
  thickness: number;
  quote: string;
  commentary: string;
  commentaryAuthor: string;
  coverImage?: string;
  spineImage?: string;
  spineBgSize?: string;
  spineBgPos?: string;
  coverBgSize?: string;
  coverBgPos?: string;
}

const COVER_W = 380;
const BOOK_GAPS = [0, 50, 70, 45, 60];

const BOOKS: BookData[] = [
  {
    title: "Principles",
    author: "Ray Dalio",
    spineColor: "#1a1a1a",
    spineTextColor: "#d0d0d0",
    coverColor: "#111111",
    coverTextColor: "#ffffff",
    height: 560,
    thickness: 140,
    quote:
      "Pain plus reflection equals progress. The most important thing is that you develop your own principles and ideally write them down.",
    commentary:
      "LineiQ is built on principles, not assumptions. Every internal decision, from clients to pricing, is part of a system. Dalio brought us the idea that principles must be written down and applied consistently.",
    commentaryAuthor: "Kondora Kristóf",
    coverImage: "/books/elvek-front.webp",
    spineImage: "/books/elvek-side.webp",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    spineColor: "#7B5B3A",
    spineTextColor: "#f0e6d4",
    coverColor: "#6B4B2A",
    coverTextColor: "#ffffff",
    height: 490,
    thickness: 100,
    quote:
      "You do not rise to the level of your goals. You fall to the level of your systems.",
    commentary:
      "This sentence is the core of LineiQ's systems thinking. It's not the goal that matters but the daily routine, the process, the automatisms. That's what we build for our clients too: systems, not one-off campaigns.",
    commentaryAuthor: "Sütő Áron",
    coverImage: "/books/atomic-front.webp",
    spineImage: "/books/atomic-side.webp",
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    spineColor: "#0055a4",
    spineTextColor: "#ffffff",
    coverColor: "#003d7a",
    coverTextColor: "#ffffff",
    height: 420,
    thickness: 82,
    quote:
      "Competition is for losers. Every moment in business happens only once. The next Bill Gates will not build an operating system.",
    commentary:
      "LineiQ isn't 'just another agency'. Awwwards-grade quality on the Hungarian market — that's zero to one. Thiel taught us that the goal isn't to win the competition but to create a new category.",
    commentaryAuthor: "Kondora Kristóf",
    coverImage: "/books/zero-front.webp",
    spineImage: "/books/zero-side.webp",
  },
  {
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    spineColor: "#2d2d2d",
    spineTextColor: "#d0d0d0",
    coverColor: "#1a1a1a",
    coverTextColor: "#ffffff",
    height: 580,
    thickness: 125,
    quote:
      "Hard things are hard because there are no easy answers or recipes. They are hard because your emotions are at odds with your logic.",
    commentary:
      "While building a company there are no good answers, only less bad decisions. Horowitz's honesty about the moments of failure gave us the courage not to avoid the hard conversations.",
    commentaryAuthor: "Sütő Áron",
    coverImage: "/books/hard-front.webp",
    spineImage: "/books/hard-side.webp",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    spineColor: "#8b0000",
    spineTextColor: "#e0c0c0",
    coverColor: "#6b0000",
    coverTextColor: "#ffffff",
    height: 510,
    thickness: 95,
    quote:
      "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.",
    commentary:
      "At LineiQ there's no Slack flood or meeting marathon. Deep work isn't a luxury but a baseline requirement. Every creative and development sprint is a direct descendant of this idea.",
    commentaryAuthor: "Kondora Kristóf",
    coverImage: "/books/deep-front.webp",
    spineImage: "/books/deep-side.webp",
  },
];

export default function BookshelfSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const entranceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const book3dRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flatCoverRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shelfLineRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const bgTitleRef = useRef<HTMLDivElement>(null);
  const bgTitleInnerRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const detailBgAuthorRef = useRef<HTMLSpanElement>(null);
  const detailLineSvgRef = useRef<SVGSVGElement>(null);
  const detailLineRef = useRef<SVGPathElement>(null);
  const detailTitleRef = useRef<HTMLHeadingElement>(null);
  const quoteOpenRef = useRef<HTMLSpanElement>(null);
  const detailQuoteRef = useRef<HTMLQuoteElement>(null);
  const quoteCloseRef = useRef<HTMLSpanElement>(null);
  const detailDividerRef = useRef<HTMLDivElement>(null);
  const detailCommentaryRef = useRef<HTMLParagraphElement>(null);
  const detailAuthorRef = useRef<HTMLSpanElement>(null);

  const textTlRef = useRef<gsap.core.Timeline | null>(null);
  const floatTweenRef = useRef<gsap.core.Tween | null>(null);

  const [activeBook, setActiveBook] = useState<number | null>(null);
  const [displayBook, setDisplayBook] = useState<number | null>(null);
  const isAnimating = useRef(false);
  const reducedRef = useRef(false);
  const openIndexRef = useRef<number | null>(null);

  // Mely lapok renderelődnek: nyugalomban csak a gerinc, interakció közben
  // mind, kinyitva csak a borító. A kamerára merőleges (élben álló) lapok
  // raszterizálása hajszálvékony vonal-artifaktokat hagy animáció közben —
  // ezért ami az adott állapotban nem látszhat, az ténylegesen rejtve van.
  const setFaceMode = useCallback(
    (index: number, mode: "spine" | "all" | "cover") => {
      const book3d = book3dRefs.current[index];
      if (!book3d) return;
      book3d.querySelectorAll<HTMLElement>("[data-face]").forEach((f) => {
        const visible =
          mode === "all" ||
          f.dataset.face === (mode === "spine" ? "spine" : "cover");
        f.style.visibility = visible ? "visible" : "hidden";
      });
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // A polcon a könyvek élükkel állnak (gerinc látszik) — ez a nyugalmi
    // elrendezés, nem mozgás, így reduced-motion mellett is megmarad.
    book3dRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { rotateY: 90, xPercent: -50 });
      setFaceMode(i, "spine");
    });

    const section = sectionRef.current;
    if (!section) return;

    // Reduced motion: a polc és a háttércím alapból látható (CSS opacity 1),
    // így a scroll-belépő fade/slide kihagyható.
    if (reducedRef.current) return;

    const ctx = gsap.context(() => {
      // Scroll-szinkronizált belépő: a polcvonal kirajzolódik, majd a könyvek
      // egyenként emelkednek a helyükre, a scroll pozíciójához kötve (scrub).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 10%",
          scrub: 1,
        },
      });

      if (shelfLineRef.current) {
        tl.fromTo(
          shelfLineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power1.inOut" },
          0
        );
      }

      if (bgTitleInnerRef.current) {
        tl.fromTo(
          bgTitleInnerRef.current,
          { opacity: 0, yPercent: 25 },
          { opacity: 1, yPercent: 0, duration: 1.1, ease: "power1.out" },
          0.1
        );
      }

      entranceRefs.current.forEach((el, i) => {
        if (!el) return;
        const at = 0.25 + i * 0.14;
        tl.fromTo(
          el,
          {
            yPercent: 112,
            rotation: i % 2 === 0 ? -5 : 5,
            transformOrigin: "50% 100%",
          },
          { yPercent: 0, rotation: 0, duration: 0.9, ease: "power2.out" },
          at
        );
        const shadow = shadowRefs.current[i];
        if (shadow) {
          tl.fromTo(
            shadow,
            { opacity: 0 },
            { opacity: 0.6, duration: 0.3, ease: "none" },
            at + 0.55
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [setFaceMode]);

  const animateTextIn = useCallback(() => {
    if (textTlRef.current) textTlRef.current.kill();

    const tl = gsap.timeline();
    textTlRef.current = tl;

    const bgAuthor = detailBgAuthorRef.current;
    const lineSvg = detailLineSvgRef.current;
    const line = detailLineRef.current;
    const title = detailTitleRef.current;
    const qOpen = quoteOpenRef.current;
    const quote = detailQuoteRef.current;
    const qClose = quoteCloseRef.current;
    const divider = detailDividerRef.current;
    const commentary = detailCommentaryRef.current;
    const author = detailAuthorRef.current;

    // --- initial states ---
    if (bgAuthor) gsap.set(bgAuthor, { opacity: 0, y: 30 });
    if (lineSvg) gsap.set(lineSvg, { opacity: 0 });
    if (line) {
      const len = line.getTotalLength();
      line.style.strokeDasharray = `${len}`;
      line.style.strokeDashoffset = `${len}`;
    }
    if (title) gsap.set(title, { y: 40, opacity: 0 });
    if (qOpen) gsap.set(qOpen, { y: 20, opacity: 0, scale: 0.7 });
    if (quote) gsap.set(quote, { y: 20, opacity: 0 });
    if (qClose) gsap.set(qClose, { y: -10, opacity: 0, scale: 0.7 });
    if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: "left center" });
    if (commentary) gsap.set(commentary, { y: 18, opacity: 0 });
    if (author) gsap.set(author, { opacity: 0, y: 10 });

    // --- red narrative line (fullscreen, behind everything) ---
    if (lineSvg)
      tl.to(lineSvg, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0);
    if (line)
      tl.to(line, { strokeDashoffset: 0, duration: 2.0, ease: "power3.out" }, 0);

    // --- background author name ---
    if (bgAuthor)
      tl.to(bgAuthor, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, 0.1);

    // --- title ---
    if (title)
      tl.to(title, { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" }, 0.25);

    // --- opening quote mark ---
    if (qOpen)
      tl.to(qOpen, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }, 0.55);

    // --- quote text ---
    if (quote)
      tl.to(quote, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.65);

    // --- closing quote mark ---
    if (qClose)
      tl.to(qClose, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }, 0.75);

    // --- divider ---
    if (divider)
      tl.to(divider, { scaleX: 1, duration: 0.6, ease: "expo.out" }, 0.85);

    // --- commentary ---
    if (commentary)
      tl.to(commentary, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 0.95);

    // --- commentary author ---
    if (author)
      tl.to(author, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, 1.2);

  }, []);

  const openBook = useCallback(
    (index: number) => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      setActiveBook(index);
      setDisplayBook(index);
      openIndexRef.current = index;
      setFaceMode(index, "all");

      if (tlRef.current) tlRef.current.kill();
      if (floatTweenRef.current) {
        floatTweenRef.current.kill();
        floatTweenRef.current = null;
      }

      const wrapper = wrapperRefs.current[index];
      const book3d = book3dRefs.current[index];
      const stage = stageRef.current;
      const detail = detailRef.current;
      const bgTitle = bgTitleRef.current;
      if (!wrapper || !book3d || !stage || !detail) {
        isAnimating.current = false;
        return;
      }

      const stageRect = stage.getBoundingClientRect();
      const bookRect = wrapper.getBoundingClientRect();
      const centerX =
        stageRect.left +
        stageRect.width * 0.35 -
        (bookRect.left + bookRect.width / 2);
      const scaledHalfH = (bookRect.height * 1.3) / 2;
      const topBound = scaledHalfH * 1.08 + 60;
      const bottomBound = stageRect.height - scaledHalfH - 20;
      const safeCenter = Math.min(bottomBound, Math.max(topBound, stageRect.height * 0.45));
      const centerY =
        stageRect.top +
        safeCenter -
        (bookRect.top + bookRect.height / 2);

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
        },
      });
      tlRef.current = tl;

      if (bgTitle) {
        tl.to(bgTitle, { opacity: 0, duration: 0.5, ease: "power2.in" }, 0);
      }

      // a kiemelt könyv kontakt-árnyéka elhalványul, ahogy a könyv elemelkedik
      const shadow = shadowRefs.current[index];
      if (shadow) {
        tl.to(shadow, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" }, 0);
      }

      // autoAlpha: az elhalványult könyv visibility: hidden-t is kap, így a
      // szétszórt könyvek teljesen kikerülnek a kompozitálásból
      wrapperRefs.current.forEach((el, i) => {
        if (i === index || !el) return;
        const dir = i < index ? -1 : 1;
        const dist = Math.abs(i - index) * 150 + 300;
        tl.to(
          el,
          {
            x: dir * dist,
            rotation: dir * 4,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          0
        );
      });

      // külön ease az x és y tengelyen — enyhe ív a középre repülésben
      tl.to(wrapper, { x: centerX, duration: 0.8, ease: "power3.out" }, 0);
      tl.to(wrapper, { y: centerY, duration: 0.8, ease: "power2.inOut" }, 0);

      tl.to(
        book3d,
        { z: 0, rotateY: 25, duration: 0.9, ease: "power3.out", overwrite: "auto" },
        0.25
      );
      tl.to(
        wrapper,
        { scale: 1.3, duration: 0.9, ease: "power3.out" },
        0.25
      );

      // A z: -thickness/2 a borító síkját pontosan z=0-ra hozza, így a
      // megálláskor a flat-váltás pixelre azonos képet ad (nincs ugrás).
      tl.to(
        book3d,
        {
          rotateY: 0,
          z: -BOOKS[index].thickness / 2,
          duration: 0.5,
          ease: "power3.inOut",
        },
        0.9
      );

      // show detail + trigger text animations
      tl.set(detail, { opacity: 1 }, 1.0);
      tl.add(() => animateTextIn(), 1.0);

      // Megálláskor a 3D dobozt egy sima 2D borító-réteg váltja le, pixelre
      // azonos pozícióban (a borító síkja épp z=0-n áll) — a lebegés alatt
      // így nincs 3D raszterizálás, a kép éles marad.
      tl.add(() => {
        const flat = flatCoverRefs.current[index];
        if (flat) {
          gsap.set(book3d, { display: "none" });
          gsap.set(flat, { display: "flex" });
        }
      }, 1.4);

      // start book floating after settle — a végtelen lebegés reduced-motion
      // mellett kimarad (folyamatos automatikus mozgás).
      if (!reducedRef.current) {
        tl.add(() => {
          // csak y tengelyen lebeg — folyamatos rotation a preserve-3d
          // rétegen GPU tile-repedéseket (átlátszó csíkokat) okoz
          floatTweenRef.current = gsap.to(wrapper, {
            y: "+=10",
            duration: 2.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }, 1.4);
      }
    },
    [animateTextIn, setFaceMode]
  );

  const closeBook = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    if (tlRef.current) tlRef.current.kill();
    if (textTlRef.current) textTlRef.current.kill();
    if (floatTweenRef.current) {
      floatTweenRef.current.kill();
      floatTweenRef.current = null;
    }

    // A 2D borító-réteg visszaadja a helyét a 3D doboznak a visszaforgatáshoz
    // — a borító síkja z=0-n áll, így a csere itt is pixelre azonos.
    const openIdx = openIndexRef.current;
    const openBook3d = openIdx !== null ? book3dRefs.current[openIdx] : null;
    const openFlat = openIdx !== null ? flatCoverRefs.current[openIdx] : null;
    const openWrapper = openIdx !== null ? wrapperRefs.current[openIdx] : null;
    if (openIdx !== null) setFaceMode(openIdx, "all");
    if (openBook3d) gsap.set(openBook3d, { clearProps: "display" });
    if (openFlat) gsap.set(openFlat, { clearProps: "display" });

    const detail = detailRef.current;
    const bgTitle = bgTitleRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        wrapperRefs.current.forEach((el, i) => {
          if (!el) return;
          // minden maradék inline transform/opacity törlése — a nyugalmi
          // állapot így bitre azonos az első renderrel, nem maradhat
          // "animálódó" render-állapot a rétegeken
          gsap.set(el, { clearProps: "transform,opacity,visibility" });
          // a hover által megemelt z-index visszaáll az eredeti sorrendre
          gsap.set(el, { zIndex: BOOKS.length - i });
        });
        // minden könyv újra gerinc-nézetben áll — csak a gerinc renderelődik
        BOOKS.forEach((_, i) => setFaceMode(i, "spine"));
        openIndexRef.current = null;
        setActiveBook(null);
        setDisplayBook(null);
        isAnimating.current = false;
      },
    });
    tlRef.current = tl;

    if (detail) {
      tl.to(detail, { opacity: 0, duration: 0.3, ease: "power3.in" }, 0);
    }

    const bgAuthor = detailBgAuthorRef.current;
    const lineSvg = detailLineSvgRef.current;
    if (bgAuthor) tl.to(bgAuthor, { opacity: 0, duration: 0.3, ease: "power3.in" }, 0);
    if (lineSvg) tl.to(lineSvg, { opacity: 0, duration: 0.3, ease: "power3.in" }, 0);

    // A szétszórt (láthatatlan) könyvek mozgatás nélkül kerülnek vissza a
    // helyükre, és ott úsznak elő — mozgó ÉS áttetsző 3D rétegek együtt
    // GPU-artifaktokat (beragadt tile-okat, "vastag" gerincet) hagytak.
    wrapperRefs.current.forEach((el, i) => {
      if (!el || i === openIdx) return;
      tl.set(el, { x: 0, y: 0, rotation: 0, scale: 1 }, 0.15);
      tl.to(el, { autoAlpha: 1, duration: 0.45, ease: "power2.out" }, 0.25);
    });

    // egyedül az aktív könyv animál: visszarepül a polcra és visszafordul
    if (openWrapper) {
      tl.to(
        openWrapper,
        { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.7, ease: "power3.out" },
        0.2
      );
    }
    if (openBook3d) {
      tl.to(
        openBook3d,
        { z: 0, rotateY: 90, duration: 0.7, ease: "power3.out", overwrite: "auto" },
        0.2
      );
    }

    shadowRefs.current.forEach((el) => {
      if (!el) return;
      tl.to(el, { opacity: 0.6, scale: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" }, 0.35);
    });

    if (bgTitle) {
      tl.to(bgTitle, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.4);
    }
  }, [setFaceMode]);

  const handleBookClick = useCallback(
    (index: number) => {
      if (activeBook === index) {
        closeBook();
      } else if (activeBook !== null) {
        closeBook();
      } else {
        openBook(index);
      }
    },
    [activeBook, openBook, closeBook]
  );

  const handleStageClick = useCallback(
    (e: React.MouseEvent) => {
      if (activeBook !== null && e.target === e.currentTarget) {
        closeBook();
      }
    },
    [activeBook, closeBook]
  );

  // Hover: a könyv előrébb csúszik a polcról (z tengelyen, a néző felé),
  // csak egészen enyhe elfordulással — így nem lóg át a szomszédokba.
  // A kihúzott könyv z-index-e felugrik, különben a balra álló (magasabb
  // z-index-ű) szomszéd levágja a kifordult borító szélét.
  const handleMouseEnter = useCallback(
    (index: number) => {
      if (activeBook !== null || isAnimating.current || reducedRef.current)
        return;
      const wrapper = wrapperRefs.current[index];
      const book3d = book3dRefs.current[index];
      const shadow = shadowRefs.current[index];
      setFaceMode(index, "all");
      if (wrapper) gsap.set(wrapper, { zIndex: 20 });
      if (book3d)
        gsap.to(book3d, { z: 50, rotateY: 84, duration: 0.45, ease: "power2.out", overwrite: "auto" });
      if (shadow)
        gsap.to(shadow, { opacity: 0.42, scale: 0.96, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    },
    [activeBook, setFaceMode]
  );

  const handleMouseLeave = useCallback(
    (index: number) => {
      if (activeBook !== null || isAnimating.current || reducedRef.current)
        return;
      const book3d = book3dRefs.current[index];
      const shadow = shadowRefs.current[index];
      if (book3d)
        gsap.to(book3d, {
          z: 0,
          rotateY: 90,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => {
            const wrapper = wrapperRefs.current[index];
            if (wrapper) gsap.set(wrapper, { zIndex: BOOKS.length - index });
            // a könyv visszaállt 90°-ra — megint csak a gerinc renderelődik
            setFaceMode(index, "spine");
          },
        });
      if (shadow)
        gsap.to(shadow, { opacity: 0.6, scale: 1, duration: 0.45, ease: "power3.out", overwrite: "auto" });
    },
    [activeBook, setFaceMode]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeBook !== null) closeBook();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeBook, closeBook]);

  const displayData = displayBook !== null ? BOOKS[displayBook] : null;

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={bgTitleRef} className={styles.bgTitle}>
        <span ref={bgTitleInnerRef} className={styles.bgTitleInner}>
          The literature that shapes us.
        </span>
      </div>

      <svg
        ref={detailLineSvgRef}
        className={styles.sectionLine}
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={detailLineRef}
          d="M 0 30 Q 360 8, 720 30 T 1440 30"
          stroke="var(--color-red)"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      {displayData && (
        <span ref={detailBgAuthorRef} className={styles.sectionBgAuthor}>
          <span>{displayData.author.split(" ")[0]}</span>
          <span>{displayData.author.split(" ").slice(1).join(" ")}</span>
        </span>
      )}

      <div
        ref={stageRef}
        className={styles.stage}
        onClick={handleStageClick}
      >
        <div className={styles.shelf}>
          {BOOKS.map((book, i) => (
            <div
              key={book.title}
              ref={(el) => {
                wrapperRefs.current[i] = el;
              }}
              className={styles.bookWrapper}
              style={{
                width: book.thickness,
                height: book.height,
                zIndex: BOOKS.length - i,
                marginLeft: BOOK_GAPS[i],
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleBookClick(i);
              }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
            >
              <div
                ref={(el) => {
                  shadowRefs.current[i] = el;
                }}
                className={styles.contactShadow}
              />
              <div
                ref={(el) => {
                  entranceRefs.current[i] = el;
                }}
                className={styles.entrance}
              >
              <div
                ref={(el) => {
                  book3dRefs.current[i] = el;
                }}
                className={styles.book3d}
                style={{ width: COVER_W, height: book.height }}
              >
                <div
                  data-face="cover"
                  className={`${styles.face} ${styles.coverFace}`}
                  style={{
                    width: COVER_W,
                    height: book.height,
                    backgroundColor: book.coverColor,
                    backgroundImage: book.coverImage
                      ? `url('${book.coverImage}')`
                      : "none",
                    backgroundSize: "100% 100%",
                    backgroundPosition: "top center",
                    color: book.coverTextColor,
                    transform: `translateZ(${book.thickness / 2}px)`,
                  }}
                >
                  {!book.coverImage && (
                    <>
                      <span className={styles.coverTitle}>{book.title}</span>
                      <span className={styles.coverAuthor}>{book.author}</span>
                    </>
                  )}
                </div>

                <div
                  data-face="spine"
                  className={`${styles.face} ${styles.spineFace}`}
                  style={{
                    width: book.thickness,
                    height: book.height,
                    left: (COVER_W - book.thickness) / 2,
                    backgroundColor: book.spineColor,
                    backgroundImage: book.spineImage
                      ? `url('${book.spineImage}')`
                      : "none",
                    backgroundSize: book.spineBgSize ?? "100% 100%",
                    backgroundPosition: book.spineBgPos ?? "center",
                    color: book.spineTextColor,
                    transform: `rotateY(-90deg) translateZ(${COVER_W / 2}px)`,
                  }}
                >
                  {!book.spineImage && (
                    <>
                      <span className={styles.spineTitle}>{book.title}</span>
                      <span className={styles.spineAuthor}>{book.author}</span>
                    </>
                  )}
                </div>

                {/* A lapozat-síkok pontosan a doboz élein futnak — beljebb tolt
                    sík a Chromium BSP plane-splitting miatt hajszálvékony
                    repedéseket vág a gerincbe/borítóba. A borítóperem-hatást
                    a face-eken belüli inset árnyékolás adja. */}
                <div
                  data-face="pages"
                  className={`${styles.face} ${styles.pagesEdge}`}
                  style={{
                    width: book.thickness,
                    height: book.height - 6,
                    left: (COVER_W - book.thickness) / 2,
                    transform: `rotateY(90deg) translateZ(${COVER_W / 2}px)`,
                  }}
                />

                <div
                  data-face="pages"
                  className={`${styles.face} ${styles.pagesTop}`}
                  style={{
                    width: COVER_W,
                    height: book.thickness,
                    transform: `rotateX(90deg) translateZ(${book.height / 2}px)`,
                  }}
                />

                <div
                  data-face="pages"
                  className={`${styles.face} ${styles.pagesBottom}`}
                  style={{
                    width: COVER_W,
                    height: book.thickness,
                    transform: `rotateX(-90deg) translateZ(${book.height / 2}px)`,
                  }}
                />

                <div
                  data-face="back"
                  className={`${styles.face} ${styles.backFace}`}
                  style={{
                    width: COVER_W,
                    height: book.height,
                    backgroundColor: book.coverColor,
                    transform: `rotateY(180deg) translateZ(${book.thickness / 2}px)`,
                  }}
                />
              </div>

              {/* 2D borító-réteg a kinyitott, lebegő állapothoz — ugyanazok
                  az osztályok adják a kinézetet, mint a 3D borítónak */}
              <div
                ref={(el) => {
                  flatCoverRefs.current[i] = el;
                }}
                aria-hidden="true"
                className={`${styles.face} ${styles.coverFace} ${styles.flatCover}`}
                style={{
                  width: COVER_W,
                  height: book.height,
                  backgroundColor: book.coverColor,
                  backgroundImage: book.coverImage
                    ? `url('${book.coverImage}')`
                    : "none",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "top center",
                  color: book.coverTextColor,
                }}
              >
                {!book.coverImage && (
                  <>
                    <span className={styles.coverTitle}>{book.title}</span>
                    <span className={styles.coverAuthor}>{book.author}</span>
                  </>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>

        <div ref={shelfLineRef} className={styles.shelfLine} />

        <div
          ref={detailRef}
          className={styles.detail}
          style={{
            opacity: 0,
            pointerEvents: activeBook !== null ? "auto" : "none",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {displayData && (
            <>
              <h3 ref={detailTitleRef} className={styles.detailTitle}>
                {displayData.title}
              </h3>

              <div className={styles.quoteBlock}>
                <span ref={quoteOpenRef} className={styles.quoteMarkFloat}>
                  &ldquo;
                </span>
                <blockquote ref={detailQuoteRef} className={styles.detailQuote}>
                  {displayData.quote}
                </blockquote>
                <span
                  ref={quoteCloseRef}
                  className={`${styles.quoteMarkFloat} ${styles.quoteMarkClose}`}
                >
                  &rdquo;
                </span>
              </div>

              <div ref={detailDividerRef} className={styles.detailDivider} />
              <p ref={detailCommentaryRef} className={styles.detailCommentary}>
                {displayData.commentary}
              </p>
              <span
                ref={detailAuthorRef}
                className={styles.detailCommentaryAuthor}
              >
                {displayData.commentaryAuthor}
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
