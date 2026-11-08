// The legal pages, /terms and /privacy (Lineiq-Website#14, PRD "The website,
// done", stories 40–42).
//
// The Hungarian text binds, the same principle as the Hungarian contract
// masters: legal wording is fixed text, not a fresh translation per run. The
// English and German pages say they are translations and that the Hungarian
// prevails, and link to it. Change the Hungarian first, then the two
// translations, then the version below.
//
// LAWYER REVIEW PENDING. Claude wrote the terms on 2026-10-25 to Hungarian
// and EU standards (Eker. tv., Ptk.) from what the site does. They ship as
// they are (Kristóf, 2026-10-21); a lawyer reviews them later
// (kontrast-vault#38 per the PRD), and that review blocks nothing.
//
// The privacy notice is not written here first. Since 2.0 (Lineiq-Website#38)
// its source is the vault: operations/studio/data-protection/templates/
// privacy-notice-hu.md (binding) and privacy-notice.md (EN). The German is
// translated from the Hungarian, with no German speaker's read yet
// (Lineiq-Website#17). Change the vault first, then these three files, then
// the version below. It was checked against the sources instead of a lawyer
// (kontrast-vault#160).

import { format } from "../../i18n/format";
import { localizePath, type Locale } from "../../i18n/routing";
import type { LegalDocumentText } from "./types";
import en from "./en";
import hu from "./hu";
import de from "./de";

export type { Fact, LegalBlock, LegalSection } from "./types";

export type LegalKind = "terms" | "privacy";

/** The language whose text binds. */
export const BINDING_LOCALE: Locale = "hu";

export const LEGAL_PATHS: Record<LegalKind, "/terms" | "/privacy"> = {
  terms: "/terms",
  privacy: "/privacy",
};

/** One version and date per document, shared by its three languages, so a
 *  translation cannot claim a different text is in force. */
export const LEGAL_VERSIONS: Record<
  LegalKind,
  { version: string; effective: string }
> = {
  terms: { version: "1.0", effective: "2026-10-25" },
  // 2.0: the extended notice (Lineiq-Website#38), written in the vault first.
  privacy: { version: "2.0", effective: "2026-11-07" },
};

export const legalTexts = { en, hu, de };

/** A date as each language writes it: "25 October 2026", "2026. október
 *  25.", "25. Oktober 2026". */
export function formatLegalDate(iso: string, locale: Locale): string {
  const tags: Record<Locale, string> = { en: "en-GB", hu: "hu-HU", de: "de-DE" };
  return new Intl.DateTimeFormat(tags[locale], {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export interface LegalPage {
  document: LegalDocumentText;
  label: string;
  versionLine: string;
  languageNote: string;
  /** The Hungarian original, on a translation; null on the Hungarian page. */
  original: { href: string; label: string } | null;
}

/** Everything a legal page renders, in one language. */
export function legalPage(kind: LegalKind, locale: Locale): LegalPage {
  const { chrome, [kind]: document } = legalTexts[locale];
  const { version, effective } = LEGAL_VERSIONS[kind];
  return {
    document,
    label: chrome.label,
    versionLine: format(chrome.versionLine, {
      version,
      date: formatLegalDate(effective, locale),
    }),
    languageNote: chrome.languageNote,
    original:
      locale === BINDING_LOCALE || chrome.original === null
        ? null
        : {
            href: localizePath(LEGAL_PATHS[kind], BINDING_LOCALE),
            label: chrome.original,
          },
  };
}

const WORD_JOINER = "⁠";

/** Keeps two things the reader takes for one word from breaking across lines:
 *  a range or pair joined by an en dash ("EU–USA", "9–11") and a chain of
 *  bracketed references ("6(1)(f)"). The text itself stays plain; the joiner
 *  is invisible and added only where it is shown. */
export function keepTogether(text: string): string {
  return text
    .replace(/(?<=\S)–(?=\S)/g, `–${WORD_JOINER}`)
    .replace(/\)\(/g, `)${WORD_JOINER}(`);
}

/** A paragraph cut at its **bold** marks. The notice sets its objection
 *  sentence and its labels in bold, so the cut is part of the text, not of
 *  the style. Odd-numbered pieces are the bold ones. */
export function emphasize(text: string): { text: string; bold: boolean }[] {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((piece, i) => ({ text: piece, bold: i % 2 === 1 }))
    .filter((piece) => piece.text !== "");
}

export type TextSegment =
  | { text: string }
  | { text: string; href: string };

// A labelled link, [label](https://…); or an email address, or a web address
// starting with www. or https://. A sentence's closing punctuation is not part
// of the address. The labelled form is for addresses too long for a phone's
// line: the label wraps, the address does not have to.
const LINKABLE =
  /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)|([\w.+-]+@[\w-]+(?:\.[\w-]+)+|(?:https:\/\/|www\.)[^\s,;)]+)/g;

/** A paragraph cut into plain text and links, so the addresses the documents
 *  name (the studio's mailbox, the authority's site) can be followed. */
export function linkify(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(LINKABLE)) {
    if (match[1] !== undefined) {
      if (match.index > last) segments.push({ text: text.slice(last, match.index) });
      segments.push({ text: match[1], href: match[2] });
      last = match.index + match[0].length;
      continue;
    }
    let found = match[3];
    const trailing = found.match(/[.:]+$/);
    if (trailing) found = found.slice(0, -trailing[0].length);
    const start = match.index;
    if (start > last) segments.push({ text: text.slice(last, start) });
    const href = found.includes("@")
      ? `mailto:${found}`
      : found.startsWith("www.")
        ? `https://${found}`
        : found;
    segments.push({ text: found, href });
    last = start + found.length;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });
  return segments;
}
