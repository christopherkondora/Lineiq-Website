"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import {
  FOOTER_CHANNELS,
  FOOTER_LABELS,
  FOOTER_LEGAL_LINKS,
  FOOTER_SITEMAP,
  FOOTER_STUDIO,
  footerCopyright,
} from "../data/footer";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={`section--dark ${styles.footer}`}>
      <div className="container">
        {/* Brand anchor — gives the footer a clear top before the link columns. */}
        <div className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="LineiQ" className={styles.logo} />
          <p className={styles.tagline}>
            Forget being ordinary<span className={styles.dot}>.</span>
          </p>
        </div>

        <div className={styles.row}>
          <div className={`${styles.col} ${styles.colStudio}`}>
            <p className={styles.label}>{FOOTER_LABELS.studio}</p>
            <p className={styles.text}>
              {FOOTER_STUDIO.name}
              <br />
              {FOOTER_STUDIO.city}
            </p>
          </div>
          <div className={`${styles.col} ${styles.colSitemap}`}>
            <p className={styles.label}>{FOOTER_LABELS.sitemap}</p>
            <ul className={styles.list}>
              {FOOTER_SITEMAP.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.col} ${styles.colConnect}`}>
            <p className={styles.label}>{FOOTER_LABELS.connect}</p>
            {/* Channels without a live URL render as plain text — no dead links. */}
            <ul className={styles.list}>
              {FOOTER_CHANNELS.map((c) => (
                <li key={c}>
                  <span className={styles.soon}>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.col} ${styles.colLegal}`}>
            <p className={styles.label}>{FOOTER_LABELS.legal}</p>
            <ul className={styles.list}>
              {FOOTER_LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.legal}>
          <span>{footerCopyright(year)}</span>
          <span>Brand. Code. Signal.</span>
        </div>
      </div>
    </footer>
  );
}
