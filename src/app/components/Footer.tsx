"use client";

import Link from "./LocaleLink";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./Footer.module.css";
import type { Dictionary } from "../i18n/dictionary";
import { format } from "../i18n/format";
import {
  FOOTER_CHANNELS,
  FOOTER_LEGAL_LINKS,
  FOOTER_SITEMAP,
  FOOTER_STUDIO_NAME,
} from "../data/footer";

export default function Footer({ t }: { t: Dictionary["footer"] }) {
  const year = new Date().getFullYear();
  return (
    <footer className={`section--dark ${styles.footer}`}>
      <div className="container">
        <div className={styles.row}>
          <div className={`${styles.col} ${styles.colStudio}`}>
            <p className={styles.label}>{t.studio}</p>
            <p className={styles.text}>
              {FOOTER_STUDIO_NAME}
              <br />
              {t.city}
            </p>
          </div>
          <div className={`${styles.col} ${styles.colSitemap}`}>
            <p className={styles.label}>{t.sitemap}</p>
            <ul className={styles.list}>
              {FOOTER_SITEMAP.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{t.links[l.id]}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.col} ${styles.colConnect}`}>
            <p className={styles.label}>{t.connect}</p>
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
            <p className={styles.label}>{t.legal}</p>
            <ul className={styles.list}>
              {FOOTER_LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{t.links[l.id]}</Link>
                </li>
              ))}
            </ul>
          </div>
          {/* The same switcher as in the menu: each entry is this page in
              that language. */}
          <div className={`${styles.col} ${styles.colLanguage}`}>
            <p className={styles.label} aria-hidden="true">
              {t.language}
            </p>
            <LanguageSwitcher label={t.language} className={styles.switcher} />
          </div>
        </div>

        <p className={styles.legal}>{format(t.copyright, { year })}</p>
      </div>
    </footer>
  );
}
