import HomeIntro, { introGateScript } from "./components/HomeIntro";
import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Work from "./components/Work";
import Partners from "./components/Partners";
import Manifesto from "./components/Manifesto";
import WhatWeDo from "./components/WhatWeDo";
import SequenceSection from "./components/SequenceSection";
import Footer from "./components/Footer";
import styles from "./page.module.css";

export default function Home() {
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
      <Hero />
      <Intro />
      <Work />
      {/* Szolgáltatások: tiszta, sorszám nélküli lista (bymonolog.com recept),
          fehér háttéren. Bal oldalon lélegző vonal-kaszkád, háttérben a hoverelt
          szolgáltatás óriás Kranky esszencia-szava, a kurzor mellé úszó noir
          fotóval. Önálló szekció — már nem parkol. */}
      <WhatWeDo />
      {/* A Partners egy self-contained, full-viewport pinnelt sequence (saját
          scroll-budget + sticky színpad). A végállapotára (We take on partners +
          hasábok) csúszik fölé a Manifesto sötét panele: a .rise negatív margója
          húzza rá, a magas z-index + átlátszatlan háttér takarja. */}
      <Partners />
      <div className={styles.rise}>
        <Manifesto />
      </div>
      <SequenceSection />
      {/* Mobilon a SequenceSection overlay footere elrejtve; helyette ez a
          normál, statikus footer folyik a szekvencia alá. Desktopon az overlay
          marad, ezt a wrapper rejti. */}
      <div className={styles.mobileFooter}>
        <Footer />
      </div>
    </main>
  );
}
