import { ReactNode } from "react";
import SplashLink from "./SplashLink";
import styles from "./Placeholder.module.css";

interface PlaceholderProps {
  label: string;
  title: ReactNode;
  signature?: string;
  lede: string;
  nextStep?: string;
  eta?: string;
}

export default function Placeholder({
  label,
  title,
  signature,
  lede,
  nextStep,
  eta = "2026 Q3",
}: PlaceholderProps) {
  return (
    <section className={styles.placeholder}>
      <div className={`container ${styles.inner}`}>
        <p className="text-label">{label}</p>

        <h1 className={`text-hero ${styles.title}`}>{title}</h1>

        {signature && (
          <p className={styles.signature}>
            <span className="text-signature">{signature}</span>
          </p>
        )}

        <p className={styles.lede}>{lede}</p>

        <div className={styles.actions}>
          <SplashLink
            href="/kapcsolat"
            className="btn-primary"
          >
            <span className="btn-label">Beszéljünk</span>
          </SplashLink>
          <SplashLink href="/" className="btn-secondary">
            <span className="btn-label">Vissza a főoldalra</span>
          </SplashLink>
        </div>

        <div className={styles.meta}>
          <div>
            <span className="text-label">Státusz</span>
            <p className={styles.metaText}>
              {nextStep ?? "Az oldal aktív fejlesztés alatt."}
            </p>
          </div>
          <div>
            <span className="text-label">Élesítés</span>
            <p className={styles.metaText}>{eta}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
