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

type FooterLinkId = keyof Dictionary["footer"]["links"];

export type FooterLink = { href: string; id: FooterLinkId };

export const FOOTER_SITEMAP: FooterLink[] = [
  { href: "/", id: "home" },
  { href: "/#services", id: "services" },
  { href: "/about", id: "about" },
  { href: "/contact", id: "contact" },
];

/* Neither page exists yet (both 404), so changing their addresses costs
   nothing now: there is nothing to redirect.

   NOTE: whatever the label says, the DOCUMENT is a Hungarian Kft.'s legal
   paper: the terms and the privacy notice probably have to be written in
   Hungarian (or bilingual) regardless of the footer (Lineiq-Website#14). */
export const FOOTER_LEGAL_LINKS: FooterLink[] = [
  { href: "/terms", id: "terms" },
  { href: "/privacy", id: "privacy" },
];

/** Channels with no live URL: present, but not links, so no dead link. */
export const FOOTER_CHANNELS: string[] = ["Instagram", "LinkedIn", "Are.na"];

export const FOOTER_STUDIO_NAME = "LineiQ Kft.";
