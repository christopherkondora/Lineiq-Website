import { NextResponse } from "next/server";
import { Resend } from "resend";

// The contact form's submission, forwarded to the studio by email through
// Resend. from/to come from the environment so they can be repointed after a
// domain verification without a code change.
//
// The payload changed on 2026-09-25 with the page: `services` and `budget` are
// gone, and `message` — the answer to the page's one question — is required in
// their place. The reasoning is in [[docs/website/2026-09-25-contact-line-path]]:
// the pricing model is two-step and conditional, so a budget band picked by a
// stranger before the diagnosis is a number we cannot act on.

interface IntakePayload {
  name: string;
  email: string;
  company: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A ceiling on what gets pasted into an email body. Generous enough that a
 *  long, considered answer arrives whole. */
const MESSAGE_MAX = 5000;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const body = (raw ?? {}) as Partial<IntakePayload>;
  const name = asString(body.name);
  const email = asString(body.email);
  const company = asString(body.company);
  const message = asString(body.message).slice(0, MESSAGE_MAX);

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 }
    );
  }
  if (!company) {
    return NextResponse.json(
      { error: "Company name is required." },
      { status: 400 }
    );
  }
  if (!message) {
    return NextResponse.json({ error: "An answer is required." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "The email service is not configured." },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM ?? "LineiQ Intake <onboarding@resend.dev>",
    to: [process.env.CONTACT_TO ?? "hello@lineiq.hu"],
    replyTo: email,
    subject: `New enquiry — ${company}`,
    text: [
      `Company: ${company}`,
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "What are you trying to build, and what is in the way?",
      message,
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
