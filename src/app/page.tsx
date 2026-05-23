import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Work from "./components/Work";
import Process from "./components/Process";
import Manifesto from "./components/Manifesto";
import CtaBlock from "./components/CtaBlock";

export default function Home() {
  return (
    <main>
      <Hero />
      <Intro />
      <Work />
      <Process />
      <Manifesto />
      <CtaBlock />
    </main>
  );
}
