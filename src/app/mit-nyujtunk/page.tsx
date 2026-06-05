import type { Metadata } from "next";
import Link from "next/link";
import SplashLink from "../components/SplashLink";
import Footer from "../components/Footer";
import { services, plainIntro } from "../data/services";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Mit nyújtunk? — LineiQ",
  description:
    "A LineiQ teljes szolgáltatási köre: brand építés, web fejlesztés, eCommerce, web és mobil alkalmazások, marketing. Egy stúdió, a teljes ív stratégiától a kódig.",
};

export default function MitNyujtunkPage() {
  return (
    <main className={styles.page}>
      <section className={`section ${styles.hero}`}>
        <div className="container">
          <p className="text-label">◆ Szolgáltatások</p>
          <h1 className={`text-statement ${styles.title}`}>
            A teljes ív,
            <br />
            <em className={styles.italic}>stratégiától a kódig.</em>
          </h1>
          <p className={styles.lede}>
            Egy stúdió, ami felépíti a márkát, megépíti a jelenlétet és növeszti
            a számokat. Öt terület, egy kéz, nincs handoff a stratégia, a design
            és a kód között.
          </p>
        </div>
      </section>

      <section className={`section ${styles.listSection}`}>
        <div className="container">
          <ul className={styles.categories}>
            {services.map((s, i) => {
              const shown = s.subServices.slice(0, 4);
              const rest = s.subServices.length - shown.length;
              return (
                <li key={s.slug}>
                  <Link href={`/mit-nyujtunk/${s.slug}`} className={styles.category}>
                    <div className={styles.categoryHead}>
                      <span className={styles.num}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={styles.essence}>{s.essence}</span>
                    </div>
                    <h2 className={styles.categoryTitle}>{s.title}</h2>
                    <p className={styles.categoryIntro}>{plainIntro(s.intro)}</p>
                    <ul className={styles.tags}>
                      {shown.map((ss) => (
                        <li key={ss.title}>{ss.title}</li>
                      ))}
                      {rest > 0 && (
                        <li className={styles.tagMore}>+{rest} további</li>
                      )}
                    </ul>
                    <span className={styles.more}>Részletek ↗</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className={`section section--dark ${styles.ctaSection}`}>
        <div className="container">
          <h2 className={`text-statement ${styles.ctaTitle}`}>
            Nem tudod, melyik kell?
          </h2>
          <p className={styles.ctaLede}>
            Mondd el, hol tartasz, és megmondjuk, mire van szükséged. Nem
            csomagot adunk el, megoldjuk a problémát.
          </p>
          <SplashLink href="/kapcsolat" className="btn-primary">
            <span className="btn-label">Beszéljünk</span>
          </SplashLink>
        </div>
      </section>

      <Footer />
    </main>
  );
}
