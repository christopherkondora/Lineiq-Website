"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import Link from "../../../components/LocaleLink";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplashLink from "../../../components/SplashLink";
import CtaSwap from "../../../components/CtaSwap";
import { plainIntro, type LocalizedCategory } from "../../../data/services";
import type { Dictionary } from "../../../i18n/dictionary";
import styles from "./page.module.css";

/**
 * The letters in a title's longest word. A word cannot be broken across lines,
 * so on a phone it is the word, not the title, that has to fit the screen:
 * "Szoftvermegoldások" is 18 letters, "Architecture" 12. The CSS scales the title
 * down by it (page.module.css, --word).
 */
function longestWord(title: string) {
  return Math.max(...title.split(/\s+/).map((word) => word.length));
}

// A Kranky aláírás dőlése kategóriánként váltakozik, hogy ne ugyanabban a
// szögben álljon minden oldalon. Determinisztikus, így az SSR és a kliens
// ugyanazt rendereli.
const ESSENCE_ANGLES = [-6, 3.5, -2, 5, -4.5];

// Editorial category chapter: oversized Fraunces opening with the Kranky
// signature, mixed-typography lede, sticky essence on the margin beside the
// numbered sub-service chapters, then a giant "next chapter" handoff.
interface CategoryArticleProps {
  /** The whole catalogue in the page's language, for the hand-off. */
  categories: LocalizedCategory[];
  index: number;
  t: Omit<Dictionary["services"], "categories">;
  /** Rendered by the server page, so its strings never pass through here. */
  footer: ReactNode;
}

export default function CategoryArticle({
  categories,
  index,
  t,
  footer,
}: CategoryArticleProps) {
  const rootRef = useRef<HTMLElement>(null);

  const service = categories[index];
  const next = categories[(index + 1) % categories.length];
  const rest = categories.filter(
    (s) => s.slug !== service.slug && s.slug !== next.slug
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Opening spread rises on load — the .reveal class holds the hidden
      // initial state so there is no flash before the tween starts. No
      // clearProps here: clearing would let .reveal hide the content again.
      gsap.to(root.querySelectorAll("[data-hero]"), {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        delay: 0.15,
        ease: "power3.out",
      });

      // Chapters and the closing blocks reveal as they enter the viewport.
      gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className={styles.page}>
      {/* ── Opening spread ── */}
      <section className={`section ${styles.hero}`}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.cascade} aria-hidden="true">
            {Array.from({ length: 15 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>

          <div className={`reveal ${styles.heroMeta}`} data-hero>
            <Link href="/#services" className={styles.back}>
              {t.allServices}
            </Link>
          </div>

          <h1
            className={`reveal ${styles.title}`}
            style={{ "--word": longestWord(service.title) } as CSSProperties}
            data-hero
          >
            {service.title}
          </h1>
          <p
            className={`reveal ${styles.essence}`}
            data-hero
            aria-hidden="true"
            style={
              {
                "--essence-rotate": `${ESSENCE_ANGLES[index % ESSENCE_ANGLES.length]}deg`,
              } as CSSProperties
            }
          >
            {service.essence}
          </p>
        </div>
      </section>

      {/* ── Chapters ── */}
      <section className={`section ${styles.chapters}`}>
        <div className={`container ${styles.chaptersGrid}`}>
          <aside className={styles.rail}>
            <p className={styles.railLabel}>{t.includes}</p>
            <p className={styles.railIntro}>{plainIntro(service.intro)}</p>
            <p className={styles.railProcess}>{t.processNote}</p>
          </aside>

          <ol className={styles.chapterList}>
            {service.subServices.map((ss, i) => (
              <li key={ss.id} className={styles.chapter} data-reveal>
                <span className={styles.chapterNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className={styles.chapterTitle}>{ss.title}</h2>
                  <p className={styles.chapterDesc}>{ss.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── The band: the page's one photograph ──
          Edge to edge between the chapters and the hand-off. The chapters are
          the argument, the next page is the next argument; this is the pause
          between them, and it has to be the whole width to read as a pause
          rather than as a picture in the margin. A second photograph beside
          the title was tried on 2026-11-11 and cut: the title, the red
          signature and the cascade already share that spread, and a fourth
          thing there is noise. Decorative, so the alt is empty; the prompt
          log sits beside the file in public/services/. */}
      <figure className={styles.band} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/services/${service.slug}-wide.webp`}
          alt=""
          width={2400}
          height={1350}
          loading="lazy"
          decoding="async"
        />
      </figure>

      {/* ── Next chapter handoff ── */}
      <section className={`section ${styles.nextSection}`}>
        <div className="container">
          <p className={styles.nextLabel} data-reveal>
            <span className={styles.diamond}>◆</span> {t.next}
          </p>
          <div data-reveal>
            <Link
              href={`/services/${next.slug}`}
              className={styles.nextLink}
            >
              <span
                className={styles.nextTitle}
                style={{ "--word": longestWord(next.title) } as CSSProperties}
              >
                {next.title}
              </span>
              <span className={styles.nextEssence} aria-hidden="true">
                {next.essence}
              </span>
            </Link>
          </div>
          <p className={styles.restRow} data-reveal>
            {t.or}{" "}
            {rest.map((o, i) => (
              <span key={o.slug}>
                <Link
                  href={`/services/${o.slug}`}
                  className={styles.restLink}
                >
                  {o.title}
                </Link>
                {i < rest.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`section section--dark ${styles.ctaSection}`}>
        <div className={`container ${styles.ctaInner}`}>
          <div data-reveal>
            <SplashLink href="/contact" className={styles.ctaLink}>
              <CtaSwap defaultLabel={t.cta} hoverLabel={t.ctaHover} />
            </SplashLink>
          </div>
        </div>
      </section>

      {footer}
    </main>
  );
}
