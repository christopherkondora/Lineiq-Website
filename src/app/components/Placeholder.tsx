import { ReactNode } from "react";
import SplashLink from "./SplashLink";
import CtaSwap from "./CtaSwap";
import styles from "./Placeholder.module.css";
import type { Dictionary } from "../i18n/dictionary";

interface PlaceholderProps {
  /** The frame's own words: the two links and the two meta labels. */
  t: Dictionary["placeholder"];
  label: string;
  title: ReactNode;
  signature?: string;
  lede: string;
  nextStep: string;
  eta: string;
}

export default function Placeholder({
  t,
  label,
  title,
  signature,
  lede,
  nextStep,
  eta,
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
          <SplashLink href="/contact" className={styles.ctaLink}>
            <CtaSwap defaultLabel={t.cta} hoverLabel={t.ctaHover} />
          </SplashLink>
          <SplashLink href="/" className={styles.backLink}>
            {t.back}
          </SplashLink>
        </div>

        <div className={styles.meta}>
          <div>
            <span className="text-label">{t.statusLabel}</span>
            <p className={styles.metaText}>{nextStep}</p>
          </div>
          <div>
            <span className="text-label">{t.launchLabel}</span>
            <p className={styles.metaText}>{eta}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
