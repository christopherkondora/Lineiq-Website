import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dictionaries } from "@/app/i18n/dictionary";
import { locales } from "@/app/i18n/routing";
import {
  BUDGET_BANDS,
  BUDGET_MODES,
  INTAKE_ERRORS,
  NEEDS,
  STAGES,
  bandOptions,
  errorMessage,
  isBandId,
  optionsOf,
} from "@/app/[locale]/contact/intake";
import {
  enquiryEmail,
  intakeLocale,
  type Enquiry,
} from "@/app/api/contact/enquiry";

type SentEmail = { subject: string; text: string; replyTo: string };
const send = vi.hoisted(() =>
  vi.fn<(email: SentEmail) => Promise<{ error: null }>>(async () => ({
    error: null,
  }))
);
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const { POST } = await import("@/app/api/contact/route");

const keys = (o: object) => Object.keys(o).sort();

describe("the contact flow in every language", () => {
  for (const locale of locales) {
    const t = dictionaries[locale].contact;

    it(`${locale} offers the same band ids per mode as the contract`, () => {
      for (const mode of BUDGET_MODES) {
        expect(keys(t.bands[mode])).toEqual([...BUDGET_BANDS[mode]].sort());
        expect(bandOptions(mode, t.bands).map((o) => o.id)).toEqual([
          ...BUDGET_BANDS[mode],
        ]);
      }
    });

    it(`${locale} labels exactly the contract's stages and needs`, () => {
      expect(keys(t.stages)).toEqual([...STAGES].sort());
      expect(keys(t.needs)).toEqual([...NEEDS].sort());
    });

    it(`${locale} has a sentence for every refusal code`, () => {
      expect(keys(t.errors)).toEqual([...INTAKE_ERRORS].sort());
    });

    it(`${locale} labels every option`, () => {
      const labels = [
        ...optionsOf(STAGES, t.stages),
        ...optionsOf(NEEDS, t.needs),
        ...BUDGET_MODES.flatMap((m) => bandOptions(m, t.bands)),
      ].map((o) => o.label);
      for (const label of labels) expect(label.trim()).not.toBe("");
    });
  }

  it("keeps the contract's order, whatever order the labels are in", () => {
    const options = optionsOf(["b", "a"] as const, { a: "A", b: "B" });
    expect(options).toEqual([
      { id: "b", label: "B" },
      { id: "a", label: "A" },
    ]);
  });
});

describe("a band id", () => {
  it("is valid only against its own mode", () => {
    expect(isBandId("monthly", "mo-2-5k")).toBe(true);
    expect(isBandId("one-time", "mo-2-5k")).toBe(false);
    expect(isBandId("monthly", "ot-75k-up")).toBe(false);
  });

  it("is never a label", () => {
    expect(isBandId("monthly", dictionaries.en.contact.bands.monthly["mo-2-5k"])).toBe(
      false
    );
  });
});

describe("a refusal's sentence", () => {
  const messages = dictionaries.en.contact.errors;

  it("is the dictionary's sentence for a known code", () => {
    expect(errorMessage(messages, "budget")).toBe(messages.budget);
  });

  it("falls back to the plain failure for anything else", () => {
    expect(errorMessage(messages, "Company name is required.")).toBe(
      messages.failed
    );
    expect(errorMessage(messages, undefined)).toBe(messages.failed);
    expect(errorMessage(messages, "toString")).toBe(messages.failed);
  });
});

describe("the submission's language", () => {
  it("is one of the site's languages, or not stated", () => {
    expect(intakeLocale("hu")).toBe("hu");
    expect(intakeLocale("de")).toBe("de");
    expect(intakeLocale("en")).toBe("en");
    expect(intakeLocale("fr")).toBeNull();
    expect(intakeLocale(undefined)).toBeNull();
    expect(intakeLocale(["hu"])).toBeNull();
  });
});

describe("the enquiry email", () => {
  const enquiry: Enquiry = {
    company: "Acme",
    email: "a@acme.test",
    stage: "selling-well",
    need: "grow",
    mode: "one-time",
    band: "ot-15-30k",
    note: "",
    locale: "hu",
  };

  it("states the visitor's language in the subject and the body", () => {
    const { subject, text } = enquiryEmail(enquiry);
    expect(subject).toBe("New enquiry [HU] — Acme");
    expect(text).toContain("Language: Hungarian");
    expect(enquiryEmail({ ...enquiry, locale: "de" }).text).toContain(
      "Language: German"
    );
    expect(enquiryEmail({ ...enquiry, locale: "en" }).subject).toBe(
      "New enquiry [EN] — Acme"
    );
  });

  it("says so when the language is not stated, and quotes no figure", () => {
    const { subject, text } = enquiryEmail({ ...enquiry, locale: null });
    expect(subject).toBe("New enquiry — Acme");
    expect(text).toContain("Language: not stated");
    expect(text).toContain("Budget: ot-15-30k (one-time, figures unknown)");
  });

  it("flags the automatic no", () => {
    expect(enquiryEmail({ ...enquiry, stage: "not-selling" }).subject).toBe(
      "New enquiry [HU] (auto-no) — Acme"
    );
  });

  it("names the answers in English and the budget as the visitor saw it", () => {
    const { text } = enquiryEmail(enquiry);
    const en = dictionaries.en.contact;
    expect(text).toContain(`Stage: ${en.stages["selling-well"]}`);
    expect(text).toContain(`Need: ${en.needs.grow}`);
    expect(text).toContain(
      `Budget: ${dictionaries.hu.contact.bands["one-time"]["ot-15-30k"]} (one-time)`
    );
    expect(text).toContain(`${en.questions.note}
(not answered)`);
  });
});

describe("POST /api/contact", () => {
  const valid = {
    company: "Acme",
    email: "a@acme.test",
    stage: "inconsistent",
    need: "rebrand",
    budget: { mode: "monthly", band: "mo-5-10k" },
    note: "",
    homepage: "",
    elapsedMs: 10_000,
    locale: "de",
  };

  const post = (body: unknown) =>
    POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    );

  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    send.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts exactly the contract's band ids, in every mode", async () => {
    for (const mode of BUDGET_MODES) {
      for (const band of BUDGET_BANDS[mode]) {
        const res = await post({ ...valid, budget: { mode, band } });
        expect(res.status, `${mode} ${band}`).toBe(200);
      }
    }
    expect(send).toHaveBeenCalledTimes(8);
  });

  it("refuses a forged band id with a 400 and sends nothing", async () => {
    const forged = [
      { mode: "monthly", band: "mo-100k-up" },
      { mode: "one-time", band: "mo-2-5k" },
      { mode: "monthly", band: "€1,000 – 2,500 / mo" },
      { mode: "yearly", band: "mo-2-5k" },
      { mode: "monthly" },
    ];
    for (const budget of forged) {
      const res = await post({ ...valid, budget });
      expect(res.status, JSON.stringify(budget)).toBe(400);
      expect(await res.json()).toEqual({
        code: "budget",
        error: dictionaries.en.contact.errors.budget,
      });
    }
    expect(send).not.toHaveBeenCalled();
  });

  it("answers every refusal with a code, and the English for older pages", async () => {
    const cases: [Record<string, unknown>, string][] = [
      [{ ...valid, company: " " }, "company"],
      [{ ...valid, email: "nope" }, "email"],
      [{ ...valid, stage: "rich" }, "steps"],
      [{ ...valid, need: undefined }, "steps"],
    ];
    for (const [body, code] of cases) {
      const res = await post(body);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.code).toBe(code);
      expect(data.error).toBe(errorMessage(dictionaries.en.contact.errors, code));
    }
  });

  it("says the service is unavailable when it has no key", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await post(valid);
    expect(res.status).toBe(500);
    expect((await res.json()).code).toBe("unavailable");
  });

  it("sends the email in the visitor's language", async () => {
    await post(valid);
    const email = send.mock.calls[0][0];
    expect(email.subject).toBe("New enquiry [DE] — Acme");
    expect(email.text).toContain("Language: German");
    expect(email.replyTo).toBe("a@acme.test");
  });

  it("still sends when the language is forged", async () => {
    const res = await post({ ...valid, locale: "<script>" });
    expect(res.status).toBe(200);
    const email = send.mock.calls[0][0];
    expect(email.text).toContain("Language: not stated");
    expect(email.text).not.toContain("<script>");
  });

  it("still sends when the language is missing, as from a page loaded before it was sent", async () => {
    const withoutLocale: Record<string, unknown> = { ...valid };
    delete withoutLocale.locale;
    const res = await post(withoutLocale);
    expect(res.status).toBe(200);
    expect(send.mock.calls[0][0].text).toContain("Language: not stated");
  });
});
