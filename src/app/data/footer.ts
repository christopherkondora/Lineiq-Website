// The footer's structure in one place. It has two renderings, on purpose:
//
//   Footer.tsx            — a standalone dark section. It closes /about,
//                           /contact, /work and the category pages at every
//                           width, and the home page below 900px.
//   SequenceSection.tsx   — an overlay on the frame sequence's canvas, under a
//                           gradient veil. The home page's desktop close; a
//                           footer written over the moving image is part of the
//                           section's composition, so it is NOT the same layout.
//
// The two used to hold the same links each, and had already drifted apart. The
// rendering can stay two; the content has to be one, or every footer change
// happens in two files with two class-name systems and the next drift is only a
// matter of time. The words are in the dictionaries (footer); here are the
// addresses, the order, and the proper nouns.

import type { Dictionary } from "../i18n/dictionary";
import { COMPANY } from "./company";

type FooterLinkId = keyof Dictionary["footer"]["links"];

export type FooterLink = { href: string; id: FooterLinkId };

export const FOOTER_SITEMAP: FooterLink[] = [
  { href: "/", id: "home" },
  { href: "/#services", id: "services" },
  { href: "/about", id: "about" },
  { href: "/contact", id: "contact" },
];

/* The legal pages, in every language; the Hungarian text binds and the
   translations say so (data/legal, Lineiq-Website#14). The addresses are
   written out rather than imported from data/legal: the footer is a client
   component, and that import would ship every legal text to the browser.
   tests/legal holds the two lists together. */
export const FOOTER_LEGAL_LINKS: FooterLink[] = [
  { href: "/terms", id: "terms" },
  { href: "/privacy", id: "privacy" },
];

/** Channels with no live URL: present, but not links, so no dead link. */
export const FOOTER_CHANNELS: string[] = ["Instagram", "LinkedIn", "Are.na"];

export const FOOTER_STUDIO_NAME = COMPANY.name;
