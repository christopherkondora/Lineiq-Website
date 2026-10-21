import type { Locale } from "../i18n/routing";
import { format } from "../i18n/format";

// The two founders. No photograph: the section was rebuilt on 2026-09-25 so it
// stops depending on a shoot nobody has booked. The portrait slot is composed
// and waiting, holding the initials until the real shots arrive — the frame,
// the blend and the motion are all built against that frame, so dropping a
// photograph in later changes one line of markup and no layout.
//
// The age is never a hardcoded number: we derive it from the
// birth dates, because "we are both 19" turns into a lie within a year and the
// whole point of that section is the honesty (World.md §3, the Limitation held
// with pride). The two dates sit one day apart, so between December 6 and 7 the
// ages differ. The copy handles that instead of averaging it away.
export interface Founder {
  /** Filename-safe id; the portrait will key off this when it exists, and the
      founder's rows in the dictionary are keyed by it. */
  id: "kondora-kristof" | "suto-aron";
  givenName: string;
  familyName: string;
  /** ISO birth date. */
  born: string;
}

// The rows under each name live in the dictionary (about.founders.lines),
// keyed by id. Facts, not characterisation: the previous set were literal
// placeholders, and the set before those described the two of us in adjectives
// a reader skims. Both founders carry four, and the count is held on purpose
// because an uneven pair reads as a lead and a second. Keep each row under ~40
// characters. It may wrap, and the row masks and rises as a block either way.
// What it must not do is say nothing.
//
// Sources, so this never has to be reconstructed from memory again: Kristof's
// client work and the Viltor relationship are in the vault at
// docs/lineiq_fundamentum.md:40, Klient at :81. The ownership split behind
// Aron's rows is identity/Culture.md:109, and three of the four Deep Research
// pillars carry owner: "Aron" in their frontmatter.
//
// The rows were placeholders from 2026-09-13 until 2026-09-25, when Kristof
// pointed out that the page was running on words that say nothing, and that its
// one factual claim about the founders was false. The replacements are facts he
// gave in session, cross-checked against the vault.
export const FOUNDERS: Founder[] = [
  {
    id: "kondora-kristof",
    givenName: "Kristóf",
    familyName: "Kondora",
    born: "2006-12-06",
  },
  {
    id: "suto-aron",
    givenName: "Áron",
    familyName: "Sütő",
    born: "2006-12-07",
  },
];

export function getFounder(id: Founder["id"]): Founder {
  return FOUNDERS.find((f) => f.id === id)!;
}

/**
 * The name as the language writes it: family name first in Hungarian, given
 * name first in English and German (Kristóf, 2026-10-21). Until then the page
 * mixed the two, "Kristóf Kondora" next to "Sütő Áron".
 */
export function founderName(founder: Founder, locale: Locale): string {
  return locale === "hu"
    ? `${founder.familyName} ${founder.givenName}`
    : `${founder.givenName} ${founder.familyName}`;
}

/**
 * What stands in the portrait slot until the commissioned shots land: the
 * initials of the name as it is written on the page. Not a placeholder in the
 * lorem-ipsum sense: the mark is designed, and the photograph replaces it inside
 * the same frame with no layout change.
 */
export function founderInitials(founder: Founder, locale: Locale): string {
  return founderName(founder, locale)
    .split(" ")
    .map((part) => part[0])
    .join("");
}

/**
 * Completed years on a given day. The month/day comparison means the day before
 * a birthday still returns the previous age.
 */
export function ageOn(born: string, on: Date): number {
  const b = new Date(born);
  let age = on.getFullYear() - b.getFullYear();
  const monthDiff = on.getMonth() - b.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && on.getDate() < b.getDate())) age -= 1;
  return age;
}

/**
 * Ages are computed on the server and passed down as props so the client never
 * hydrates to a different number. The route revalidates daily, so on the two
 * December birthdays the correct figure is live within a day.
 */
export function founderAges(on: Date = new Date()): number[] {
  return FOUNDERS.map((f) => ageOn(f.born, on));
}

/**
 * Opening line of the record's closing paragraph. When the two ages differ
 * (exactly one day a year, between December 6 and 7) it states both instead of
 * collapsing them into a single claim that would be wrong for one of us.
 */
export function ageSentence(
  ages: number[],
  t: { ageSame: string; ageDifferent: string }
): string {
  const unique = Array.from(new Set(ages)).sort((a, b) => a - b);
  if (unique.length === 1) return format(t.ageSame, { age: unique[0] });
  return format(t.ageDifferent, { younger: unique[0], older: unique[1] });
}
