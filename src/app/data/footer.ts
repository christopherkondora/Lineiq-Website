// A footer TARTALMA egy helyen. Két megjelenítése van, és ez szándékos:
//
//   Footer.tsx            — önálló sötét szekció. Ez zárja az /about, /contact,
//                           /work és a szolgáltatás-oldalakat minden szélességen,
//                           a főoldalt pedig 900px alatt.
//   SequenceSection.tsx   — overlay a frame-szekvencia vásznán, gradiens
//                           lepellel. A főoldal desktop lezárása; a mozgókép
//                           fölé írt footer a szekció kompozíciójának a része,
//                           ezért NEM ugyanaz a layout.
//
// A kettő korábban külön-külön tartalmazta ugyanazokat a linkeket, és már el is
// csúsztak egymástól. A megjelenítés maradhat kettő, a tartalomnak egynek kell
// lennie — különben minden footer-módosítás két fájlban, két osztálynévrendszerrel
// történik, és a következő eltérés csak idő kérdése.

export type FooterLink = { href: string; label: string };

export const FOOTER_SITEMAP: FooterLink[] = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/* A címkék és az útvonalak is angolok, mint az oldal többi része. A korábbi
   "ÁSZF" / "Adatkezelési tájékoztató" a magyar nyelvű változatból maradt itt.
   Egyik oldal sem létezik még (mindkettő 404), ezért az útvonal-váltásnak most
   nincs ára: nincs mit átirányítani.

   FIGYELEM: a címke angol, a DOKUMENTUM viszont egy magyar Kft. jogi irata —
   az ÁSZF és az adatkezelési tájékoztató tartalma vélhetően magyarul (vagy
   kétnyelvűen) kell hogy elkészüljön, függetlenül attól, mi áll a footerben. */
export const FOOTER_LEGAL_LINKS: FooterLink[] = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

/** Élő URL nélküli csatornák: ott vannak, de nem linkek — döglött link nincs. */
export const FOOTER_CHANNELS: string[] = ["Instagram", "LinkedIn", "Are.na"];

export const FOOTER_STUDIO = { name: "LineiQ Kft.", city: "Budapest, HU" };

export const FOOTER_LABELS = {
  studio: "Studio",
  sitemap: "Sitemap",
  connect: "Connect",
  legal: "Legal",
} as const;

/** Az évszám a build/render idejéből jön, nem beégetve. */
export const footerCopyright = (year: number) =>
  `© ${year} LineiQ. All rights reserved.`;
