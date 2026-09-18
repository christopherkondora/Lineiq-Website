// The two founders. The age is never a hardcoded number: we derive it from the
// birth dates, because "we are both 19" turns into a lie within a year and the
// whole point of that section is the honesty (World.md §3, the Limitation held
// with pride). The two dates sit one day apart, so between December 6 and 7 the
// ages differ. The copy handles that instead of averaging it away.
export interface Founder {
  /** Filename-safe id; the photo slot will key off this. */
  id: string;
  initials: string;
  name: string;
  /** ISO birth date. */
  born: string;
  /** Four short rows, hung over the bottom edge of the portrait. Exactly four:
      the block straddles the frame so two rows fall on the image and two on the
      page, and a fifth would push the balance off. Keep each row under ~28
      characters — they render through mix-blend-mode: difference, where a long
      wrapped line degrades much faster than a short set one. */
  lines: string[];
  /** Side of the offset composition. */
  align: "left" | "right";
  /** Portrait path under /public.

      Both founders currently point at the same stand-in photograph, which is why
      the section shows one face twice. It is a placeholder for judging the
      composition against a real portrait — not a picture of either of us — and
      it must not survive to production. The commissioned shots replace it one
      path at a time. */
  photo: string;
}

// Retired on 2026-09-13 when the role/line pair was replaced by the four-row
// block. Kept because they are the only written characterisation of the two of
// us that exists, and the replacement rows are still placeholders:
//
//   Kristof — role: "Execution, operations, and everything we ship in code."
//             line: "Builds the systems the studio runs on, then runs the studio
//                    on them first. If a process cannot survive being used on us,
//                    it does not get sold."
//   Aron    — role: "Strategy, story, and the people we build with."
//             line: "Starts every engagement from the customer's own words, never
//                    from ours. The positioning is finished when the client
//                    recognizes themselves in it."

export const FOUNDERS: Founder[] = [
  {
    id: "kondora-kristof",
    initials: "KK",
    name: "Kondora Kristóf",
    born: "2006-12-06",
    lines: [
      "Placeholder copy.",
      "Four rows, written by",
      "Kristof, replace these",
      "before this ships.",
    ],
    align: "left",
    photo: "/founders/placeholder-portrait.png",
  },
  {
    id: "suto-aron",
    initials: "SÁ",
    name: "Sütő Áron",
    born: "2006-12-07",
    lines: [
      "Placeholder copy.",
      "Four rows, written by",
      "Aron, replace these",
      "before this ships.",
    ],
    align: "right",
    photo: "/founders/placeholder-portrait.png",
  },
];

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
 * Opening line of the Refusals section. When the two ages differ (exactly one
 * day a year, between December 6 and 7) it states both instead of collapsing
 * them into a single claim that would be wrong for one of us.
 */
export function ageSentence(ages: number[]): string {
  const unique = Array.from(new Set(ages)).sort((a, b) => a - b);
  if (unique.length === 1) return `We are both ${unique[0]}.`;
  return `We are ${unique.join(" and ")}.`;
}
