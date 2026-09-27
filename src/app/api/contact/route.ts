import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  BUDGET_BANDS,
  EMAIL_RE,
  HONEYPOT_FIELD,
  MIN_ELAPSED_MS,
  NEEDS,
  NOTE_MAX,
  STAGES,
  isBandId,
  isBudgetMode,
  isNeedId,
  isStageId,
  labelOf,
  type BudgetMode,
} from "../../contact/intake";

// The contact flow's submission, forwarded to the studio by email through
// Resend. from/to come from the environment so they can be repointed after a
// domain verification without a code change.
//
// The payload changed on 2026-09-26 with the page
// ([[docs/website/2026-09-26-contact-qualify-flow]]): `name` is gone, because
// the flow does not ask for one and the reply template has to work without it;
// `message` became the optional `note`; and the three qualification answers
// arrive as enums that are validated here against the same list the form
// renders from. A band id the server does not recognise is a 400, not a pass
// through into the email body.

const FALLBACK_TO = "hello@lineiqgroup.com";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Nothing sent, and a 200 anyway. A bot that learns which submissions were
 *  rejected learns how to pass; a human who somehow trips one of these sees
 *  the normal confirmation and their mail is lost, which is the cost, and it
 *  is smaller than a visible failure on the studio's only conversion
 *  surface. */
function silentlyDiscard() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const body = (raw ?? {}) as Record<string, unknown>;

  // ── Spam, before anything else ─────────────────────────────
  // The route had no protection of any kind before this. It is a public POST
  // that sends mail, and it will be found.
  if (asString(body[HONEYPOT_FIELD])) return silentlyDiscard();

  const elapsed = body.elapsedMs;
  if (typeof elapsed !== "number" || !Number.isFinite(elapsed)) {
    return silentlyDiscard();
  }
  if (elapsed < MIN_ELAPSED_MS) return silentlyDiscard();

  // ── The answers ────────────────────────────────────────────
  const company = asString(body.company);
  const email = asString(body.email);
  const note = asString(body.note).slice(0, NOTE_MAX);
  const stage = body.stage;
  const need = body.need;
  const budget = (body.budget ?? {}) as Record<string, unknown>;
  const mode = budget.mode;
  const bandId = budget.band;

  if (!company) {
    return NextResponse.json(
      { error: "Company name is required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 }
    );
  }
  if (!isStageId(stage) || !isNeedId(need)) {
    return NextResponse.json(
      { error: "Answer every step and we will have something to work with." },
      { status: 400 }
    );
  }
  if (!isBudgetMode(mode) || !isBandId(mode as BudgetMode, bandId)) {
    return NextResponse.json(
      { error: "Pick a budget and we will have something to work with." },
      { status: 400 }
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "The email service is not configured." },
      { status: 500 }
    );
  }

  // Triage happens in a phone inbox, so the automatic no flags itself in the
  // subject line. That is the difference between deciding in a second and
  // opening the mail. Nothing about the visitor's side changes: the reply is
  // still written by a person.
  const autoNo = stage === "not-selling";

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM ?? "LineiQ Intake <onboarding@resend.dev>",
    // The fallback is the address the page itself prints, and it is a real
    // mailbox. It used to be hello@lineiq.hu, a domain the studio does not
    // read, so an unset CONTACT_TO mailed into nothing and said nothing.
    to: [process.env.CONTACT_TO ?? FALLBACK_TO],
    replyTo: email,
    subject: `New enquiry${autoNo ? " (auto-no)" : ""} — ${company}`,
    text: [
      `Company: ${company}`,
      `Email: ${email}`,
      `Stage: ${labelOf(STAGES, stage)}`,
      `Need: ${labelOf(NEEDS, need)}`,
      `Budget: ${labelOf(BUDGET_BANDS[mode], String(bandId))} (${mode})`,
      "",
      "Anything we should know?",
      note || "(not answered)",
    ].join("\n"),
  });

  if (error) {
    console.error("Intake email send failed:", error.message);
    return NextResponse.json(
      { error: "Submission failed, please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
