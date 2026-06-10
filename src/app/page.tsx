import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Work from "./components/Work";
import Process from "./components/Process";
import Manifesto from "./components/Manifesto";
import SequenceSection from "./components/SequenceSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <Hero />
      <Intro />
      <Work />
      {/* Process parks at the top (sticky) while the Manifesto scrolls up over
          it — the layered hand-off. */}
      <div className={styles.stack}>
        <div className={styles.stackSticky}>
          <Process />
        </div>
        <Manifesto />
      </div>
      <SequenceSection />
    </main>
  );
}
