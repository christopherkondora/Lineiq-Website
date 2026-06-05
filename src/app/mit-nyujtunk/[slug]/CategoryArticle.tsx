"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplashLink from "../../components/SplashLink";
import CtaSwap from "../../components/CtaSwap";
import Footer from "../../components/Footer";
import { services, plainIntro } from "../../data/services";
import styles from "./page.module.css";

// A Kranky aláírás dőlése kategóriánként váltakozik, hogy ne ugyanabban a
// szögben álljon minden oldalon. Determinisztikus, így az SSR és a kliens
// ugyanazt rendereli.
const ESSENCE_ANGLES = [-6, 3.5, -2, 5, -4.5];

// Editorial category chapter: oversized Fraunces opening with the Kranky
// signature, mixed-typography lede, sticky essence on the margin beside the
// numbered sub-service chapters, then a giant "next chapter" handoff.
export default function CategoryArticle({ index }: { index: number }) {
  const rootRef = useRef<HTMLElement>(null);

  const service = services[index];
  const next = services[(index + 1) % services.length];
  const rest = services.filter(
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
            <Link href="/mit-nyujtunk" className={styles.back}>
              Minden szolgáltatás
            </Link>
          </div>

          <h1 className={`reveal ${styles.title}`} data-hero>
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
            <p className={styles.railLabel}>Amit tartalmaz</p>
            <p className={styles.railIntro}>{plainIntro(service.intro)}</p>
          </aside>

          <ol className={styles.chapterList}>
            {service.subServices.map((ss, i) => (
              <li key={ss.title} className={styles.chapter} data-reveal>
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

      {/* ── Next chapter handoff ── */}
      <section className={`section ${styles.nextSection}`}>
        <div className="container">
          <p className={styles.nextLabel} data-reveal>
            <span className={styles.diamond}>◆</span> Következő
          </p>
          <div data-reveal>
            <Link
              href={`/mit-nyujtunk/${next.slug}`}
              className={styles.nextLink}
            >
              <span className={styles.nextTitle}>{next.title}</span>
              <span className={styles.nextEssence} aria-hidden="true">
                {next.essence}
              </span>
            </Link>
          </div>
          <p className={styles.restRow} data-reveal>
            Vagy:{" "}
            {rest.map((o, i) => (
              <span key={o.slug}>
                <Link
                  href={`/mit-nyujtunk/${o.slug}`}
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
            <SplashLink href="/kapcsolat" className={styles.ctaLink}>
              <CtaSwap defaultLabel="Kezdjük el." hoverLabel="Beszéljünk!" />
            </SplashLink>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
