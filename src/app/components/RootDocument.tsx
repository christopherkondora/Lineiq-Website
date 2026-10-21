import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Wix_Madefor_Display, Kranky } from "next/font/google";
import "../globals.css";
import SmoothScroll from "./SmoothScroll";
import Cursor from "./Cursor";
import Navbar from "./Navbar";
import { LocaleProvider } from "../i18n/LocaleProvider";
import { getDictionary } from "../i18n/dictionary";
import type { Locale } from "../i18n/routing";
import { SITE_INDEXABLE, SITE_URL } from "../data/site";

// The document both root layouts render: app/[locale]/layout.tsx for the
// visitor pages and app/(private)/layout.tsx for the working routes. Two root
// layouts because <html lang> has to come from the [locale] segment, and the
// private routes live outside it. One component so the two cannot drift.

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

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "LineiQ — Brand. Code. Signal.",
  description:
    "Premium brand-building agency and software house. Western-European quality, Hungarian market knowledge.",
  // Inherited by every route, so no page can opt itself back in by accident.
  // Lifts with SITE_INDEXABLE on launch day. See [[data/site]].
  robots: SITE_INDEXABLE ? undefined : { index: false, follow: false },
  // With translate="no" on <html>: browsers must not machine-translate the
  // page. Translation rewrites the text nodes that SplitText, CtaSwap and the
  // scroll sequences have split and measured, and the layout falls apart. A
  // visitor changes language with the switcher instead.
  other: { google: "notranslate" },
};

export default function RootDocument({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      translate="no"
      className={`${fraunces.variable} ${wix.variable} ${kranky.variable}`}
      // a főoldal gate-scriptje paint előtt data-intro attribútumot tehet fel
      suppressHydrationWarning
    >
      <body>
        <LocaleProvider locale={locale}>
          <SmoothScroll />
          <Cursor />
          <Navbar t={dict.nav} switcherLabel={dict.languageSwitcher.label} />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
