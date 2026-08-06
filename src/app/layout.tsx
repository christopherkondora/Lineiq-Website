import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Wix_Madefor_Display, Kranky } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";

// Paint előtt dönt a betöltési intróról: csak első session-látogatáskor és
// nem reduced-motion mellett kerül fel a html[data-preloader] attribútum.
// Ilyenkor a hero vonalai zaj-módban indulnak, a szöveg és a navbar pedig
// CSS-ből rejtve vár (data-gate-hide) — nincs FOUC. Az attribútumot a Hero
// veszi le a megnyugvás után.
// Az attribútum értéke a variáns: "type" (tipográfiai — a cím hibásan szedve
// indul és helyreáll) vagy "wave" (a korábbi zaj→nyugalom hullám). A Hero és
// a gate-CSS is ebből dolgozik, tehát egy helyen átváltható.
const INTRO_VARIANT = "type";
const preloaderGate = `try{if(!sessionStorage.getItem("lineiq-preloaded")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-preloader","${INTRO_VARIANT}")}catch(e){}`;

// Csak az opsz tengely: a betöltési intro ("hibásan szedett" cím, ami helyre
// áll) ebből él, és a wght amúgy is variábilis. A SOFT/WONK tengely mérve
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
  title: "LineiQ — Brand. Code. Signal.",
  description:
    "Premium brand-building agency and software house. Western-European quality, Hungarian market knowledge.",
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
      // a preloader gate-script paint előtt data-preloader attribútumot tehet fel
      suppressHydrationWarning
    >
      <body>
        <Script id="preloader-gate" strategy="beforeInteractive">
          {preloaderGate}
        </Script>
        <SmoothScroll />
        <Cursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
