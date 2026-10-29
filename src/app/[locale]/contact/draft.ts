// The visitor's answers, kept for the length of the tab.
//
// The flow lives in client state, and the notice link under Send leaves the
// page: coming back mounts a fresh flow with every answer gone. A draft in
// sessionStorage is what survives that trip. Session, not local: it is gone
// with the tab, so nothing a visitor typed outlives the visit, and it is never
// sent anywhere until they press Send.
//
// Whatever is read back is checked against the intake lists before it is used.
// The storage is the visitor's to edit, and a stale draft from an older build
// must not put an id into the flow that the route would refuse.

import {
  BUDGET_BANDS,
  BUDGET_MODES,
  EMAIL_RE,
  NEEDS,
  STAGES,
  type BandId,
  type BudgetMode,
  type NeedId,
  type StageId,
} from "./intake";

export const DRAFT_KEY = "lineiq-contact-draft";

const P_WHO = 1;
const P_REVIEW = 6;

export interface Draft {
  company: string;
  email: string;
  stage: StageId | null;
  need: NeedId | null;
  budgetMode: BudgetMode;
  band: BandId | null;
  note: string;
  /** The panel the visitor was on. */
  at: number;
}

const text = (v: unknown): string => (typeof v === "string" ? v : "");

/** The draft in `raw`, or null when there is nothing worth restoring. */
export function parseDraft(raw: string | null): Draft | null {
  if (!raw) return null;
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    data = parsed as Record<string, unknown>;
  } catch {
    return null;
  }

  const budgetMode = BUDGET_MODES.find((m) => m === data.budgetMode);
  const mode: BudgetMode = budgetMode ?? "monthly";
  const draft: Draft = {
    company: text(data.company),
    email: text(data.email),
    stage: STAGES.find((s) => s === data.stage) ?? null,
    need: NEEDS.find((n) => n === data.need) ?? null,
    budgetMode: mode,
    band: BUDGET_BANDS[mode].find((b) => b === data.band) ?? null,
    note: text(data.note),
    at: 0,
  };

  // Back on the panel they left, but never past what the answers have earned.
  const earned = !(
    draft.company.trim().length > 0 && EMAIL_RE.test(draft.email.trim())
  )
    ? P_WHO
    : draft.stage === null
      ? P_WHO + 1
      : draft.need === null
        ? P_WHO + 2
        : draft.band === null
          ? P_WHO + 3
          : P_REVIEW;
  const at = typeof data.at === "number" ? Math.floor(data.at) : 0;
  draft.at = Math.max(0, Math.min(at, earned));

  const empty =
    !draft.company &&
    !draft.email &&
    !draft.stage &&
    !draft.need &&
    !draft.band &&
    !draft.note;
  return empty ? null : draft;
}
