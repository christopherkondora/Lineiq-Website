"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={`section--dark ${styles.footer}`}>
      <div className="container">
        <div className={styles.giant}>
          <span className={styles.giantA}>Line</span>
          <span className={styles.giantB}>iQ</span>
          <span className={styles.giantDot}>.</span>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <p className="text-label">Stúdió</p>
            <p className={styles.text}>
              LineiQ Kft.
              <br />
              Budapest, HU
            </p>
          </div>
          <div className={styles.col}>
            <p className="text-label">Oldaltérkép</p>
            <ul className={styles.list}>
              <li><Link href="/munkaink">Munkáink</Link></li>
              <li><Link href="/mit-nyujtunk">Mit nyújtunk?</Link></li>
              <li><Link href="/rolunk">Rólunk</Link></li>
              <li><Link href="/kapcsolat">Kapcsolat</Link></li>
              <li>
                <a
                  href="https://academy.lineiqgroup.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Academy ↗
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.col}>
            <p className="text-label">Közösség</p>
            <ul className={styles.list}>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Are.na</a></li>
            </ul>
          </div>
          <div className={styles.col}>
            <p className="text-label">Ökoszisztéma</p>
            <ul className={styles.list}>
              <li><a href="#">Klient — SaaS</a></li>
              <li><a href="#">Miért? — Podcast</a></li>
              <li><a href="#">Kova — Tanfolyam</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.legal}>
          <span>© {year} LineiQ. Minden jog fenntartva.</span>
          <span>Felejtsd el az átlagost.</span>
        </div>
      </div>
    </footer>
  );
}
