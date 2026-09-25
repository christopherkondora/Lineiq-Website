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
  /** Filename-safe id; the portrait will key off this when it exists. */
  id: string;
  /** Stands in the portrait slot until the commissioned shots land. Not a
      placeholder in the lorem-ipsum sense: the mark is designed, and the
      photograph replaces it inside the same frame with no layout change. */
  initials: string;
  name: string;
  /** ISO birth date. */
  born: string;
  /** Four short rows under the name. Exactly four: the pair of columns balances
      on an equal row count, and a fifth on one side tips it. Keep each row under
      ~28 characters — the name above them rises through mix-blend-mode:
      difference, and a long wrapped row breaks that column's rhythm. */
  lines: string[];
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
