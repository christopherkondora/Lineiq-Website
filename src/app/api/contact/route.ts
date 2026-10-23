import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  EMAIL_RE,
  HONEYPOT_FIELD,
  MIN_ELAPSED_MS,
  NOTE_MAX,
  isBandId,
  isBudgetMode,
  isNeedId,
  isStageId,
  type IntakeError,
} from "../../[locale]/contact/intake";
import { dictionaries } from "../../i18n/dictionary";
import { enquiryEmail, intakeLocale } from "./enquiry";

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
//
// Since Lineiq-Website#8 the form is in three languages. The ids it submits are
// the same in every one of them, so nothing here reads a label. The page adds
// `locale`, which the email states, and a refusal is answered with a code the
// page turns into a sentence in its own language. The English sentence rides
// along in `error`, which is the field a page loaded before that change reads.

const FALLBACK_TO = "hello@lineiqgroup.com";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function refuse(code: IntakeError, status: number) {
  return NextResponse.json(
    { code, error: dictionaries.en.contact.errors[code] },
    { status }
  );
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
    return refuse("failed", 400);
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
  const band = budget.band;

  if (!company) return refuse("company", 400);
  if (!EMAIL_RE.test(email)) return refuse("email", 400);
  if (!isStageId(stage) || !isNeedId(need)) return refuse("steps", 400);
  if (!isBudgetMode(mode) || !isBandId(mode, band)) {
    return refuse("budget", 400);
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Intake email not sent: RESEND_API_KEY is not set.");
    return refuse("unavailable", 500);
  }

  const { subject, text } = enquiryEmail({
    company,
    email,
    stage,
    need,
    mode,
    band,
    note,
    locale: intakeLocale(body.locale),
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM ?? "LineiQ Intake <onboarding@resend.dev>",
    // The fallback is the address the page itself prints, and it is a real
    // mailbox. It used to be hello@lineiq.hu, a domain the studio does not
    // read, so an unset CONTACT_TO mailed into nothing and said nothing.
    to: [process.env.CONTACT_TO ?? FALLBACK_TO],
    replyTo: email,
    subject,
    text,
  });

  if (error) {
    console.error("Intake email send failed:", error.message);
    return refuse("failed", 502);
  }

  return NextResponse.json({ ok: true });
}
