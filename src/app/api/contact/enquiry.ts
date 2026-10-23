import { dictionaries } from "../../i18n/dictionary";
import type { Locale } from "../../i18n/routing";
import type {
  BandId,
  BudgetMode,
  NeedId,
  StageId,
} from "../../[locale]/contact/intake";

// The enquiry email to the founders, as a pure function of a validated
// submission. The route sends what this returns and nothing else.
//
// The email is the founders' working copy, so it is in English whatever the
// visitor's language, with one exception: the budget is quoted as the visitor
// saw it, because the figures behind a band differ by language (forints on
// /hu, Lineiq-Website#13) and an English label would quote a sum nobody chose.
// The language itself is stated twice, in the subject and the body, because
// it decides which language the reply is written in.

export interface Enquiry {
  company: string;
  email: string;
  stage: StageId;
  need: NeedId;
  mode: BudgetMode;
  band: BandId;
  note: string;
  /** null when the submission did not say, or said something that is not one
   *  of the site's languages. */
  locale: Locale | null;
}

/** Each language named for the founders, not in its own language. */
const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  hu: "Hungarian",
  de: "German",
};

export function enquiryLanguage(locale: Locale | null): string {
  return locale ? LANGUAGE_NAMES[locale] : "not stated";
}

export function enquiryEmail(e: Enquiry): { subject: string; text: string } {
  const english = dictionaries.en.contact;
  const seen = dictionaries[e.locale ?? "en"].contact;
  const bands = seen.bands[e.mode] as Record<string, string>;

  // Triage happens in a phone inbox, so the automatic no and the language
  // flag themselves in the subject line. That is the difference between
  // deciding in a second and opening the mail. Nothing about the visitor's
  // side changes: the reply is still written by a person.
  const autoNo = e.stage === "not-selling";
  const tag = e.locale ? `[${e.locale.toUpperCase()}] ` : "";

  return {
    subject: `${tag}New enquiry${autoNo ? " (auto-no)" : ""} — ${e.company}`,
    text: [
      `Company: ${e.company}`,
      `Email: ${e.email}`,
      `Language: ${enquiryLanguage(e.locale)}`,
      `Stage: ${english.stages[e.stage]}`,
      `Need: ${english.needs[e.need]}`,
      `Budget: ${bands[e.band] ?? e.band} (${e.mode})`,
      "",
      "Anything we should know?",
      e.note || "(not answered)",
    ].join("\n"),
  };
}
