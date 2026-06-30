import { NextResponse } from "next/server";
import { Resend } from "resend";

// Az intake form beküldése — emailben megy tovább a stúdiónak Resenden át.
// A from/to env-ből jön, hogy a domain verifikáció után átállítható legyen
// kódváltoztatás nélkül.

interface IntakePayload {
  company: string;
  services: string[];
  budget: string;
  name: string;
  email: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const company = asString(body.company);
  const email = asString(body.email);
  const name = asString(body.name);
  const budget = asString(body.budget);
  const services = Array.isArray(body.services)
    ? body.services.filter((s): s is string => typeof s === "string")
    : [];

  if (!company) {
    return NextResponse.json({ error: "Company name is required." }, { status: 400 });
  }
  if (services.length === 0) {
    return NextResponse.json(
      { error: "At least one service must be selected." },
      { status: 400 }
    );
  }
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 }
    );
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
    subject: `New project intake — ${company}`,
    text: [
      `Company: ${company}`,
      `Services: ${services.length ? services.join(", ") : "—"}`,
      `Budget: ${budget || "—"}`,
      `Name: ${name}`,
      `Email: ${email}`,
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
