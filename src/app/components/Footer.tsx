"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

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
          <div className={styles.col}>
            <p className={styles.label}>Studio</p>
            <p className={styles.text}>
              LineiQ Kft.
              <br />
              Budapest, HU
            </p>
          </div>
          <div className={styles.col}>
            <p className={styles.label}>Sitemap</p>
            <ul className={styles.list}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/#services">Services</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className={styles.col}>
            <p className={styles.label}>Connect</p>
            {/* Channels without a live URL render as plain text — no dead links. */}
            <ul className={styles.list}>
              <li><span className={styles.soon}>Instagram</span></li>
              <li><span className={styles.soon}>LinkedIn</span></li>
              <li><span className={styles.soon}>Are.na</span></li>
            </ul>
          </div>
          <div className={styles.col}>
            <p className={styles.label}>Legal</p>
            <ul className={styles.list}>
              <li><Link href="/aszf">ÁSZF</Link></li>
              <li><Link href="/adatkezelesi-tajekoztato">Adatkezelési tájékoztató</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.legal}>
          <span>© {year} LineiQ. All rights reserved.</span>
          <span>Brand. Code. Signal.</span>
        </div>
      </div>
    </footer>
  );
}
