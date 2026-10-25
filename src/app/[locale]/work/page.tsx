import { notFound } from "next/navigation";
import SplashLink from "../../components/SplashLink";
import CtaSwap from "../../components/CtaSwap";
import Footer from "../../components/Footer";
import { getDictionary } from "../../i18n/dictionary";
import { isLocale } from "../../i18n/routing";
import { metadataFor } from "../../i18n/seo";
import styles from "./page.module.css";

export const generateMetadata = metadataFor("/work");

// There is no published case study yet (About says so too), so the page owns
// it instead of promising a launch date: the headline is struck through in the
// red of the Partners redaction and answered by hand. "not yet." is a mark,
// Kranky and English in every language, like the essence words.
export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.work;

  return (
    <main>
      <section className={styles.page}>
        <div className={`container ${styles.inner}`}>
          <p className="text-label">◆ {t.label}</p>

          <h1 className={`text-hero ${styles.title}`}>
            {t.titleLines.map((line, i) => (
              <span key={i} className={styles.line}>
                {line}
              </span>
            ))}
            <span className={styles.answer}>
              <span className="text-signature">not yet.</span>
            </span>
          </h1>

          <p className={styles.lede}>{t.lede}</p>

          <div className={styles.actions}>
            <SplashLink href="/contact" className={styles.ctaLink}>
              <CtaSwap defaultLabel={t.cta} hoverLabel={t.ctaHover} />
            </SplashLink>
            <SplashLink href="/" className={styles.backLink}>
              {t.back}
            </SplashLink>
          </div>
        </div>
      </section>
      <Footer t={dict.footer} />
    </main>
  );
}
