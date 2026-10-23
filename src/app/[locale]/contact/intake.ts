// The /contact flow's contract. One file, because two sides depend on it and
// they are not allowed to drift: the form renders these ids and the route
// validates them. A band the server does not recognise is a 400, and the only
// way to keep that honest is for both ends to read the same list.
//
// The ids are the same in every language. What each one is called is in the
// dictionaries (contact.stages, contact.needs, contact.bands), keyed by these
// ids; optionsOf() joins the two. The route never reads a label to validate,
// so a translation cannot change what the server accepts (Lineiq-Website#8).
//
// The reasoning is in [[docs/website/2026-09-26-contact-qualify-flow]] in the
// vault. The short version: five steps, two typed fields, three clicks. Every
// click is a disqualification signal anchored on a hard filter of the ICP, not
// a package selector — which is the thing the persona rejects on sight, and the
// reason nothing here is a card with a feature list under it.

import { isLocale, type Locale } from "../../i18n/routing";

export interface Option<T extends string> {
  id: T;
  label: string;
}

/** Step 2 — hard filter 1, money proven. `not-selling` is an automatic no and
 *  the form does not say so: the no is said by email, by a person. */
export const STAGES = ["not-selling", "inconsistent", "selling-well"] as const;

export type StageId = (typeof STAGES)[number];

/** Step 3 — service fit. Recognisable without a subtitle, which is the whole
 *  specification: an earlier draft asked about ambition instead and was cut for
 *  making the visitor interpret the question. */
export const NEEDS = ["grow", "rebrand", "remarket", "launch"] as const;

export type NeedId = (typeof NEEDS)[number];

export type BudgetMode = "monthly" | "one-time";

/**
 * Step 4 — ability to pay.
 *
 * The figures behind each band are in the dictionaries, because they are
 * allowed to differ by language: forints on /hu, euros elsewhere, and set by
 * Kristóf (Lineiq-Website#13). The ids are not, so every language submits a
 * band the route already knows.
 *
 * Four bands on each side is load-bearing, not symmetry for its own sake: the
 * grid must not reflow when the switch is thrown. The labels change and nothing
 * moves.
 */
export const BUDGET_BANDS = {
  monthly: ["mo-under-2k", "mo-2-5k", "mo-5-10k", "mo-10k-up"],
  "one-time": ["ot-under-15k", "ot-15-30k", "ot-30-75k", "ot-75k-up"],
} as const satisfies Record<BudgetMode, readonly string[]>;

export type BandId<M extends BudgetMode = BudgetMode> =
  (typeof BUDGET_BANDS)[M][number];

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

/**
 * What the route answers a refused submission with: a code, never a sentence,
 * so the visitor reads the reason in their own language (contact.errors). The
 * route does not know which language the page is in and should not have to.
 */
export const INTAKE_ERRORS = [
  "company",
  "email",
  "steps",
  "budget",
  "unavailable",
  "failed",
] as const;

export type IntakeError = (typeof INTAKE_ERRORS)[number];

export function isStageId(value: unknown): value is StageId {
  return STAGES.some((id) => id === value);
}

export function isNeedId(value: unknown): value is NeedId {
  return NEEDS.some((id) => id === value);
}

export function isBudgetMode(value: unknown): value is BudgetMode {
  return value === "monthly" || value === "one-time";
}

/** A band id is only valid against its own mode. Sending `mo-10k-up` with
 *  `one-time` is a forged payload, not a typo, and it is rejected. */
export function isBandId<M extends BudgetMode>(
  mode: M,
  value: unknown
): value is BandId<M> {
  return (BUDGET_BANDS[mode] as readonly string[]).includes(value as string);
}

export function isIntakeError(value: unknown): value is IntakeError {
  return INTAKE_ERRORS.some((code) => code === value);
}

/** The ids in the contract's order, each with its label in one language. */
export function optionsOf<T extends string>(
  ids: readonly T[],
  labels: Record<T, string>
): Option<T>[] {
  return ids.map((id) => ({ id, label: labels[id] }));
}

/** A language's band labels, per mode. Typed by the ids, so a band the
 *  dictionary lacks fails the build. */
export type BandLabels = { [M in BudgetMode]: Record<BandId<M>, string> };

/** The four bands of one mode, in one language. */
export function bandOptions(
  mode: BudgetMode,
  labels: BandLabels
): Option<BandId>[] {
  return optionsOf<BandId>(
    BUDGET_BANDS[mode],
    labels[mode] as Record<BandId, string>
  );
}

/** The sentence for a refused submission. Anything the route did not mean to
 *  say, an old deployment's free text or a proxy's error page, reads as the
 *  plain failure rather than as nothing. */
export function errorMessage(
  messages: Record<IntakeError, string>,
  code: unknown
): string {
  return isIntakeError(code) ? messages[code] : messages.failed;
}

/** The language a submission says it came from. Anything that is not one of
 *  the site's languages is not stated, rather than refused: the language is a
 *  courtesy to the reply, not an answer the visitor gave. */
export function intakeLocale(value: unknown): Locale | null {
  return typeof value === "string" && isLocale(value) ? value : null;
}
