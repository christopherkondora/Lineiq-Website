import type { Metadata } from "next";
import AboutHero from "../components/AboutHero";
import AboutOrigin from "../components/AboutOrigin";
import AboutCompounds from "../components/AboutCompounds";
import AboutBeliefs from "../components/AboutBeliefs";
import AboutFounders from "../components/AboutFounders";
import AboutRefusals from "../components/AboutRefusals";
import BookshelfSection from "../components/BookshelfSection";
import AboutClose from "../components/AboutClose";
import Footer from "../components/Footer";
import { ageSentence, founderAges } from "../data/founders";

export const metadata: Metadata = {
  title: "About — LineiQ",
  description:
    "A brand and business architecture studio built in Hungary. Our mission, the five beliefs we run on and what they cost us, what we refuse, and the two founders behind it.",
};

// The founders' ages are derived from their birth dates, so the page has to be
// re-rendered occasionally or a static build would freeze the number forever.
// Daily is plenty: the two birthdays are in December and a day of lag on one of
// them is invisible.
export const revalidate = 86400;

export default function AboutPage() {
  const ages = founderAges();

  return (
    <main>
      <AboutHero />
      <AboutOrigin />
      {/* The Ism, on its own viewport. It shares AboutOrigin's black with no
          seam: the prose argues its way to the word "compounds", and the
          section below detonates it. Same movement, so same background. */}
      <AboutCompounds />
      <AboutBeliefs />
      <AboutFounders />
      <AboutRefusals ageSentence={ageSentence(ages)} />
      {/* AboutMentors used to sit here: five names the studio runs on, rendered
          as initials in rectangles. It was cut on 2026-09-07. The roster was
          never confirmed, and structurally it was the borrowed-authority
          section, five famous people standing in for our own claims. The shelf
          stays because the commentary on it is signed and first-person. The
          roster itself is not lost: it lives in the vault at World.md §4. */}
      <BookshelfSection />
      <AboutClose />
      <Footer />
    </main>
  );
}
