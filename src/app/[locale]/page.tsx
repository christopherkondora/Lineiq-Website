import { notFound } from "next/navigation";
import HomeIntro, { introGateScript } from "../components/HomeIntro";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import Work from "../components/Work";
import Partners from "../components/Partners";
import Manifesto from "../components/Manifesto";
import WhatWeDo from "../components/WhatWeDo";
import SequenceSection from "../components/SequenceSection";
import Footer from "../components/Footer";
import SplashLink from "../components/SplashLink";
import CtaSwap from "../components/CtaSwap";
import { getDictionary } from "../i18n/dictionary";
import { isLocale } from "../i18n/routing";
import { metadataFor } from "../i18n/seo";
import { localizedServices } from "../data/services";
import styles from "./page.module.css";

export const generateMetadata = metadataFor("/");

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.home;
  const categories = localizedServices(dict.services.categories).map(
    ({ slug, title }) => ({ slug, title })
  );

  return (
    <main>
      {/* Még az első festés előtt fut, és csak ezen az útvonalon: eldönti,
          kell-e a betöltési gesztus (első session-látogatás, nem reduced-
          motion). A fedő markupja alatta van, tehát mire a böngésző odaér,
          a döntés már megszületett. */}
      <script
        id="lineiq-intro-gate"
        dangerouslySetInnerHTML={{ __html: introGateScript }}
      />
      <HomeIntro />
      <Hero t={t.hero} />
      <Intro t={t.intro} />
      <Work t={t.work} />
      {/* Szolgáltatások: tiszta, sorszám nélküli lista (bymonolog.com recept),
          fehér háttéren. Bal oldalon lélegző vonal-kaszkád, háttérben a hoverelt
          szolgáltatás óriás Kranky esszencia-szava, a kurzor mellé úszó noir
          fotóval. Önálló szekció — már nem parkol. */}
      <WhatWeDo categories={categories} />
      {/* A Partners egy self-contained, full-viewport pinnelt sequence (saját
          scroll-budget + sticky színpad). A végállapotára (We take on partners +
          hasábok) csúszik fölé a Manifesto sötét panele: a .rise negatív margója
          húzza rá, a magas z-index + átlátszatlan háttér takarja. */}
      <Partners t={t.partners} />
      <div className={styles.rise}>
        <Manifesto t={t.manifesto} />
      </div>
      <SequenceSection t={t.close} footer={dict.footer} />
      {/* Mobilon a SequenceSection overlay footere elrejtve; helyette ez a
          normál, statikus footer folyik a szekvencia alá. Desktopon az overlay
          marad, ezt a wrapper rejti.

          The phone also gets the sequence's closing ask ("Ready? Let's
          begin."), which it lost with the sequence. Ask and footer share one
          screen: on their own, the footer centred in a full screen of black
          left a half-empty band after the Manifesto (Lineiq-Website#10). */}
      <div className={styles.mobileFooter}>
        <div className={`section--dark ${styles.mobileClose}`}>
          <p className={styles.mobileCloseHeadline}>{t.close.headline}</p>
          <SplashLink href="/contact" className={styles.mobileCloseCta}>
            <CtaSwap
              defaultLabel={t.close.cta}
              hoverLabel={t.close.ctaHover}
            />
          </SplashLink>
        </div>
        <Footer t={dict.footer} />
      </div>
    </main>
  );
}
