import type { Metadata } from "next";
import { Fraunces, Wix_Madefor_Display, Kranky } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";

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
    "Prémium brandépítő ügynökség és szoftverház. Nyugat-európai minőség, magyar piaci tudás.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" className={`${fraunces.variable} ${wix.variable} ${kranky.variable}`}>
      <body>
        <SmoothScroll />
        <Cursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
