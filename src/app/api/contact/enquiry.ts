import { dictionaries } from "../../i18n/dictionary";
import { isLocale, type Locale } from "../../i18n/routing";
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
// For the same reason a submission with no language gets no figure at all,
// only the band's id: guessing the currency is how a budget is misread by about
// four hundred times. The language itself is stated twice, in the subject
// and the body, because it decides which language the reply is written in.

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

/** The language a submission says it came from. Anything that is not one of
 *  the site's languages is not stated, rather than refused: the language is a
 *  courtesy to the reply, not an answer the visitor gave. */
export function intakeLocale(value: unknown): Locale | null {
  return typeof value === "string" && isLocale(value) ? value : null;
}

export function enquiryLanguage(locale: Locale | null): string {
  return locale ? LANGUAGE_NAMES[locale] : "not stated";
}

/** The band as the visitor saw it, or its id when nobody can say which
 *  currency they saw it in. */
function budgetLine(e: Enquiry): string {
  if (!e.locale) return `${e.band} (${e.mode}, figures unknown)`;
  const bands = dictionaries[e.locale].contact.bands[e.mode] as Record<
    string,
    string
  >;
  return `${bands[e.band] ?? e.band} (${e.mode})`;
}

export function enquiryEmail(e: Enquiry): { subject: string; text: string } {
  const english = dictionaries.en.contact;

  // Triage happens in a phone inbox, so the language and the automatic no
  // flag themselves in the subject line, after the words a mail rule matches
  // on. That is the difference between deciding in a second and opening the
  // mail. Nothing about the visitor's side changes: the reply is still written
  // by a person.
  const tag = e.locale ? ` [${e.locale.toUpperCase()}]` : "";
  const autoNo = e.stage === "not-selling" ? " (auto-no)" : "";

  return {
    subject: `New enquiry${tag}${autoNo} — ${e.company}`,
    text: [
      `Company: ${e.company}`,
      `Email: ${e.email}`,
      `Language: ${enquiryLanguage(e.locale)}`,
      `Stage: ${english.stages[e.stage]}`,
      `Need: ${english.needs[e.need]}`,
      `Budget: ${budgetLine(e)}`,
      "",
      english.questions.note,
      e.note || "(not answered)",
    ].join("\n"),
  };
}
