// The /contact flow's contract. One file, because two sides depend on it and
// they are not allowed to drift: the form renders these labels and the route
// validates these ids. A band the server does not recognise is a 400, and the
// only way to keep that honest is for both ends to read the same list.
//
// The reasoning is in [[docs/website/2026-09-26-contact-qualify-flow]] in the
// vault. The short version: five steps, two typed fields, three clicks. Every
// click is a disqualification signal anchored on a hard filter of the ICP, not
// a package selector — which is the thing the persona rejects on sight, and the
// reason nothing here is a card with a feature list under it.

export interface Option<T extends string> {
  id: T;
  label: string;
}

/** Step 2 — hard filter 1, money proven. `not-selling` is an automatic no and
 *  the form does not say so: the no is said by email, by a person. */
export const STAGES = [
  { id: "not-selling", label: "Not selling yet" },
  { id: "inconsistent", label: "Selling, but inconsistently" },
  { id: "selling-well", label: "Selling well, want more" },
] as const satisfies readonly Option<string>[];

export type StageId = (typeof STAGES)[number]["id"];

/** Step 3 — service fit. Recognisable without a subtitle, which is the whole
 *  specification: an earlier draft asked about ambition instead and was cut for
 *  making the visitor interpret the question. */
export const NEEDS = [
  { id: "grow", label: "Grow" },
  { id: "rebrand", label: "Rebrand" },
  { id: "remarket", label: "Remarket" },
  { id: "launch", label: "Launch something new" },
] as const satisfies readonly Option<string>[];

export type NeedId = (typeof NEEDS)[number]["id"];

export type BudgetMode = "monthly" | "one-time";

/**
 * Step 4 — ability to pay, in euro, because the pricing model is denominated in
 * euro throughout.
 *
 * Anchored on Pricing Modell Fázis 1, which is where the studio actually is:
 * personal track €2,000–5,000 setup plus €2,000–4,000/mo, company track
 * €15,000–30,000 per project. The top band on each side reaches into Fázis 2 so
 * an inbound above the current phase has somewhere to land instead of topping
 * out at the studio's ceiling.
 *
 * Four bands on each side is load-bearing, not symmetry for its own sake: the
 * grid must not reflow when the switch is thrown. The labels change and nothing
 * moves.
 */
export const BUDGET_BANDS: Record<BudgetMode, readonly Option<string>[]> = {
  monthly: [
    { id: "mo-under-2k", label: "Under €2,000 / mo" },
    { id: "mo-2-5k", label: "€2,000 – 5,000 / mo" },
    { id: "mo-5-10k", label: "€5,000 – 10,000 / mo" },
    { id: "mo-10k-up", label: "€10,000+ / mo" },
  ],
  "one-time": [
    { id: "ot-under-15k", label: "Under €15,000" },
    { id: "ot-15-30k", label: "€15,000 – 30,000" },
    { id: "ot-30-75k", label: "€30,000 – 75,000" },
    { id: "ot-75k-up", label: "€75,000+" },
  ],
};

export const BUDGET_MODES: BudgetMode[] = ["monthly", "one-time"];

/** The ceiling on the optional line. A guard against a paste, not an allowance:
 *  there is deliberately no client-side maxlength, because a control that
 *  silently stops accepting characters is worse than one that accepts a long
 *  answer the server then trims. */
export const NOTE_MAX = 5000;

/** How long a human takes, at the very fastest, to fill this in. Anything
 *  quicker is a bot and is discarded. See the spam note in the route. */
export const MIN_ELAPSED_MS = 3000;

/**
 * The honeypot's field name.
 *
 * It must NOT be an autofill token: not `name`, not `phone`, not `url`, not
 * `address`. A password manager filling a hidden field it recognises would
 * discard a real lead and nobody would ever find out. `homepage` is a field a
 * bot wants and a browser has no opinion about.
 */
export const HONEYPOT_FIELD = "homepage";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isStageId(value: unknown): value is StageId {
  return STAGES.some((o) => o.id === value);
}

export function isNeedId(value: unknown): value is NeedId {
  return NEEDS.some((o) => o.id === value);
}

export function isBudgetMode(value: unknown): value is BudgetMode {
  return value === "monthly" || value === "one-time";
}

/** A band id is only valid against its own mode. Sending `mo-10k-up` with
 *  `one-time` is a forged payload, not a typo, and it is rejected. */
export function isBandId(mode: BudgetMode, value: unknown): boolean {
  return BUDGET_BANDS[mode].some((b) => b.id === value);
}

export function labelOf(
  options: readonly Option<string>[],
  id: string
): string {
  return options.find((o) => o.id === id)?.label ?? id;
}
