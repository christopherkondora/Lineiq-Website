// What the two of them built before either had a client, rendered as the thing
// a reader can check rather than a number they have to take on faith.
//
// The count is deliberately not the headline. "22 frameworks" is the same class
// of claim as "500+ projects delivered": unverifiable, and inflated by everyone.
// AboutBeliefs already set the standard this page is held to — a competitor can
// lift any conviction and stay true, none of them can lift a cost. A count is
// liftable. A named instrument a prospect can use thirty seconds after reading
// it is not.
//
// Dates and word counts are deliberately absent. The Academy locked v1 on
// 2026-05-22 and v2 on 2026-06-10, roughly half a million words in v1, and
// publishing that chronology invites exactly one conclusion — generated — three
// sections below our own belief that we "publish less, and slower, than firms
// that mass-generate". The volume metric contradicts the conviction, so the
// volume metric stays off the page.
//
// Home definitions live in the vault at academy/_Frameworks.md. Do not restate
// a framework's meaning here in different words; if a line needs changing, the
// canonical index changes first.

export interface Framework {
  /** v2 canonical name. The v1 aliases are not for public use. */
  name: string;
  /** One line, in our voice, that the reader can apply immediately. */
  line: string;
}

/** Five of twenty-two. Chosen because each one works on first contact, with no
    setup: a reader can run the Stop-Paying Test on their own spend before they
    finish the sentence. The remaining seventeen are not secrets, they are just
    not first impressions. */
export const FRAMEWORKS: Framework[] = [
  {
    name: "The Compound vs Tax Engine",
    line: "Every forint you spend either builds an asset or pays rent.",
  },
  {
    name: "The Stop-Paying Test",
    line: "If you stopped paying for this tomorrow, would the work survive?",
  },
  {
    name: "The ROI Autopsy",
    line: "We find where the current spend is dying before we propose anything.",
  },
  {
    name: "The Velvet Rope",
    line: "People are screened out before any deep work begins, not after.",
  },
  {
    name: "The Future Walk",
    line: "Day 1, 30, 90 and 365, walked through before an offer exists.",
  },
];

/** The shape, not the size. Structure is the thing mass-generated volume does
    not have, which is why the architecture is quotable and the word count is
    not. */
export const METHOD_SHAPE = {
  frameworks: 22,
  layers: 11,
  masterclasses: 7,
} as const;
