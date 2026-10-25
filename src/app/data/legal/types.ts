// The shape of a legal document, the same in every language, so a translation
// can be checked against the Hungarian block for block (tests/legal.test.ts).

/** A labelled line: the company's data, the cookie's properties. A null value
 *  is not known yet and its row is left out (see data/company). */
export type Fact = readonly [label: string, value: string | null];

/** A paragraph, a bulleted list, or a run of labelled facts. */
export type LegalBlock =
  | string
  | { list: readonly string[] }
  | { facts: readonly Fact[] };

export interface LegalSection {
  heading: string;
  blocks: readonly LegalBlock[];
}

export interface LegalDocumentText {
  title: string;
  sections: readonly LegalSection[];
}

/** The words around a document, in its language. */
export interface LegalChrome {
  /** The small label above the title. */
  label: string;
  /** What this text is: the binding Hungarian, or a translation of it. */
  languageNote: string;
  /** The link to the Hungarian original. Null on the Hungarian page. */
  original: string | null;
  /** `{version}` and `{date}` are filled in from LEGAL_VERSIONS. */
  versionLine: string;
}

export interface LegalTexts {
  chrome: LegalChrome;
  terms: LegalDocumentText;
  privacy: LegalDocumentText;
}
