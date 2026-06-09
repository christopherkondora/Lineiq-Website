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
      "A LineiQ nem feltételezésekre, hanem elvekre alapul. Minden belső döntés, ügyféltől az árazásig, egy rendszer része. Dalio hozta el azt a gondolkodást, hogy az elveket le kell írni és következetesen alkalmazni.",
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
      "Ez a mondat a LineiQ rendszerszemléletének magja. Nem a cél számít, hanem a napi rutin, a folyamat, az automatizmusok. Ezt építjük az ügyfeleinknek is: rendszereket, nem egyszeri kampányokat.",
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
      "A LineiQ nem 'még egy ügynökség'. Awwwards-szintű minőség a magyar piacon — ez a nulláról egyből. Thiel megtanította, hogy a cél nem a verseny megnyerése, hanem egy új kategória létrehozása.",
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
      "Cégépítés közben nincsenek jó válaszok, csak kevésbé rossz döntések. Horowitz őszintesége a kudarc pillanatairól adta a bátorságot, hogy a nehéz beszélgetéseket ne kerüljük ki.",
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
      "A LineiQ-nál nincs Slack-áradat és meeting-maraton. A mélymunka nem luxus, hanem alapkövetelmény. Minden kreatív és fejlesztési sprint ennek a gondolatnak a közvetlen leszármazottja.",
    commentaryAuthor: "Kondora Kristóf",
    coverImage: "/books/deep-front.webp",
    spineImage: "/books/deep-side.webp",
  },
];

export default function BookshelfSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const book3dRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailRef = useRef<HTMLDivElement>(null);
  const bgTitleRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    book3dRefs.current.forEach((el) => {
      if (el) gsap.set(el, { rotateY: 90, xPercent: -50 });
    });

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (shelfRef.current) {
        gsap.fromTo(
          shelfRef.current,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 90%" },
          }
        );
      }
      if (bgTitleRef.current) {
        gsap.fromTo(
          bgTitleRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 90%" },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

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

      wrapperRefs.current.forEach((el, i) => {
        if (i === index || !el) return;
        const dir = i < index ? -1 : 1;
        const dist = Math.abs(i - index) * 150 + 300;
        tl.to(
          el,
          { x: dir * dist, opacity: 0, duration: 0.7, ease: "power3.out" },
          0
        );
      });

      tl.to(
        wrapper,
        { x: centerX, y: centerY, duration: 0.8, ease: "power3.out" },
        0
      );

      tl.to(
        book3d,
        { rotateY: 25, duration: 0.9, ease: "power3.out" },
        0.25
      );
      tl.to(
        wrapper,
        { scale: 1.3, duration: 0.9, ease: "power3.out" },
        0.25
      );

      tl.to(
        book3d,
        { rotateY: 0, duration: 0.5, ease: "power3.inOut" },
        0.9
      );

      // show detail + trigger text animations
      tl.set(detail, { opacity: 1 }, 1.0);
      tl.add(() => animateTextIn(), 1.0);

      // start book floating after settle
      tl.add(() => {
        floatTweenRef.current = gsap.to(wrapper, {
          y: "+=10",
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }, 1.4);
    },
    [animateTextIn]
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

    const detail = detailRef.current;
    const bgTitle = bgTitleRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
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

    wrapperRefs.current.forEach((el) => {
      if (!el) return;
      tl.to(
        el,
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        0.2
      );
    });

    book3dRefs.current.forEach((el) => {
      if (!el) return;
      tl.to(el, { rotateY: 90, duration: 0.7, ease: "power3.out" }, 0.2);
    });

    if (bgTitle) {
      tl.to(bgTitle, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.4);
    }
  }, []);

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

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (activeBook !== null) return;
      const el = wrapperRefs.current[index];
      if (el) gsap.to(el, { y: -12, duration: 0.3, ease: "power2.out" });
    },
    [activeBook]
  );

  const handleMouseLeave = useCallback(
    (index: number) => {
      if (activeBook !== null) return;
      const el = wrapperRefs.current[index];
      if (el) gsap.to(el, { y: 0, duration: 0.3, ease: "power2.out" });
    },
    [activeBook]
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
        Irodalom, ami formál minket.
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
        <div ref={shelfRef} className={styles.shelf}>
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
                  book3dRefs.current[i] = el;
                }}
                className={styles.book3d}
                style={{ width: COVER_W, height: book.height }}
              >
                <div
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

                <div
                  className={`${styles.face} ${styles.pagesEdge}`}
                  style={{
                    width: book.thickness,
                    height: book.height - 6,
                    left: (COVER_W - book.thickness) / 2,
                    transform: `rotateY(90deg) translateZ(${COVER_W / 2}px)`,
                  }}
                />

                <div
                  className={`${styles.face} ${styles.pagesTop}`}
                  style={{
                    width: COVER_W,
                    height: book.thickness,
                    transform: `rotateX(90deg) translateZ(${book.height / 2}px)`,
                  }}
                />

                <div
                  className={styles.face}
                  style={{
                    width: COVER_W,
                    height: book.thickness,
                    backgroundColor: "#d8d3c8",
                    transform: `rotateX(-90deg) translateZ(${book.height / 2}px)`,
                  }}
                />

                <div
                  className={styles.face}
                  style={{
                    width: COVER_W,
                    height: book.height,
                    backgroundColor: book.coverColor,
                    transform: `rotateY(180deg) translateZ(${book.thickness / 2}px)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

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
