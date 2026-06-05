"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import styles from "./Navbar.module.css";
import SplashLink from "./SplashLink";
import CtaSwap from "./CtaSwap";

type MenuItem = {
  label: string;
  href: string;
  external?: boolean;
};

const menuItems: MenuItem[] = [
  { label: "Munkáink", href: "/munkaink" },
  { label: "Mit nyújtunk?", href: "/mit-nyujtunk" },
  { label: "Rólunk", href: "/rolunk" },
  { label: "Kapcsolat", href: "/kapcsolat" },
  { label: "Academy", href: "https://academy.lineiqgroup.com", external: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [hideCta, setHideCta] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const lastY = useRef(0);
  const forceHeaderRef = useRef(false);

  // IntersectionObserver: [data-always-header] szekcióba lépéskor
  // mindig mutatja a headert és elrejti a CTA-t.
  useEffect(() => {
    const els = document.querySelectorAll("[data-always-header]");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting);
        forceHeaderRef.current = anyVisible;
        setHideCta(anyVisible);
        if (anyVisible) setHidden(false);
      },
      { rootMargin: "0px 0px -99% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (forceHeaderRef.current) {
        setHidden(false);
      } else if (y > 100 && y > lastY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = y;

      const navHeight = navRef.current?.offsetHeight ?? 92;
      const probe = document.elementFromPoint(40, navHeight + 4) as HTMLElement | null;
      setOnDark(!!probe?.closest(".section--dark, [data-dark]"));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const items = itemsRef.current?.querySelectorAll("li");
    if (!overlay || !items) return;

    if (open) {
      document.body.style.overflow = "hidden";
      gsap.to(overlay, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.8,
        ease: "power3.inOut",
      });
      gsap.fromTo(
        items,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "power3.inOut",
      });
    }
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header
        ref={navRef}
        className={`${styles.navbar} ${hidden && !open ? styles.hidden : ""} ${
          onDark || open ? styles.onDark : ""
        }`}
      >
        <Link href="/" className={styles.logo} aria-label="LineiQ főoldal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={onDark || open ? "/logo-white.svg" : "/logo-black.svg"}
            alt="LineiQ"
            className={styles.logoImg}
          />
        </Link>

        <div className={styles.right}>
          {!hideCta && (
            <SplashLink
              href="/kapcsolat"
              className={styles.cta}
              onClick={closeMenu}
            >
              <CtaSwap defaultLabel="Beszéljünk?" hoverLabel="Vágjunk bele!" />
            </SplashLink>
          )}

          <button
            className={styles.toggle}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
          >
            <span className={`${styles.bar} ${open ? styles.barOpenA : ""}`} />
            <span className={`${styles.bar} ${open ? styles.barOpenB : ""}`} />
          </button>
        </div>
      </header>

      <div
        ref={overlayRef}
        className={styles.overlay}
        aria-hidden={!open}
        role="dialog"
      >
        <nav className={styles.menuInner}>
          <ul ref={itemsRef} className={styles.menuList}>
            {menuItems.map((item) =>
              item.external ? (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className={styles.menuLink}
                  >
                    <span>{item.label}</span>
                    <span className={styles.menuArrow}>↗</span>
                  </a>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={styles.menuLink}
                  >
                    <span>{item.label}</span>
                    <span className={styles.menuArrow}>↗</span>
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className={styles.menuFooter}>
            <div>
              <p className="text-label">Stúdió</p>
              <p className={styles.menuFooterText}>Budapest, HU</p>
            </div>
            <div>
              <p className="text-label">Kapcsolat</p>
              <p className={styles.menuFooterText}>hello@lineiq.hu</p>
            </div>
            <div>
              <p className="text-label">Közösség</p>
              <p className={styles.menuFooterText}>Instagram — LinkedIn</p>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
