import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Work from "./components/Work";
import WeAre from "./components/WeAre";
import Partners from "./components/Partners";
import Manifesto from "./components/Manifesto";
import WhatWeDo from "./components/WhatWeDo";
import SequenceSection from "./components/SequenceSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Hero />
      <Intro />
      <Work />
      {/* Beszédes identitás-interstitial (ashleybrookecs.com "we are multilingual"
          recept, LineiQ nyelven): óriás Fraunces állítás betűnkénti maszk-reveallel,
          híd a munkák és a szolgáltatások között. */}
      <WeAre />
      {/* "Trusted Referrals" recept LineiQ-ül: óriás verzál fejléc + piros Kranky
          script-szó, ami balról jobbra rajzolódik be, alatta két hasáb. */}
      <Partners />
      {/* Szolgáltatások: tiszta, sorszám nélküli lista (bymonolog.com recept),
          fehér háttéren. Bal oldalon lélegző vonal-kaszkád, háttérben a hoverelt
          szolgáltatás óriás Kranky esszencia-szava, a kurzor mellé úszó noir
          fotóval. A .stack wrapper HATÁROLJA a sticky tartományt: a WhatWeDo csak
          a wrapperen belül parkol (viewport aljára), a Manifesto (sötét,
          átlátszatlan panel) fölé csúszik fel, majd a wrapper végén kiold — így
          a szolgáltatások NEM bukkannak elő újra, és a frame-synced
          SequenceSection tisztán következik. */}
      <div className={styles.stack}>
        <div className={styles.stackSticky}>
          <WhatWeDo />
        </div>
        <div className={styles.rise}>
          <Manifesto />
        </div>
      </div>
      <SequenceSection />
    </main>
  );
}
