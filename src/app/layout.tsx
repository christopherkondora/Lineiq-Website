import type { Metadata } from "next";
import { Fraunces, Wix_Madefor_Display, Kranky } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import { SITE_INDEXABLE, SITE_URL } from "./data/site";

// A betöltési gesztus NEM innen indul. Korábban itt ült egy layout-szintű
// script, ami minden útvonalon feltette a html[data-preloader] attribútumot,
// de levenni csak a Hero tudta — az pedig kizárólag a főoldalon renderel.
// Aloldalra érkezve (keresőből, megosztott linkről) a scroll-zár így soha nem
// oldódott fel. A gesztus most a főoldalhoz van kötve, és a zárat ugyanaz a
// komponens teszi fel, amelyik le is veszi: [[components/HomeIntro]].

// Csak az opsz tengely: a wght amúgy is variábilis. A SOFT/WONK tengely mérve
// ~45 KB-tal hizlalta a fájlt, láthatóan érzékelhető nyereség nélkül.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const wix = Wix_Madefor_Display({
  subsets: ["latin"],
  variable: "--font-wix",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const kranky = Kranky({
  subsets: ["latin"],
  variable: "--font-kranky",
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "LineiQ — Brand. Code. Signal.",
  description:
    "Premium brand-building agency and software house. Western-European quality, Hungarian market knowledge.",
  // Inherited by every route, so no page can opt itself back in by accident.
  // Lifts with SITE_INDEXABLE on launch day. See [[data/site]].
  robots: SITE_INDEXABLE ? undefined : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${wix.variable} ${kranky.variable}`}
      // a főoldal gate-scriptje paint előtt data-intro attribútumot tehet fel
      suppressHydrationWarning
    >
      <body>
        <SmoothScroll />
        <Cursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
