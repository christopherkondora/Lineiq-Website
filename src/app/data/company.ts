// The company behind the site, as the law asks it to be named: the footer, the
// terms and the privacy notice all read it from here (Lineiq-Website#14). The
// Eker. tv. 4. § requires a Hungarian site to publish its operator's name,
// seat, registration and tax number, an email address, and its host.
//
// A field that is null is not known to the repo yet. The legal pages leave its
// row out rather than print a blank, so a missing number shows up as a missing
// line, never as "null". Fill them in from the company papers; they are public
// registry data, so they belong here, unlike anything from the contracts.

export interface Company {
  /** The short name (rövidített cégnév). */
  name: string;
  /** The full registered name (cégnév). */
  legalName: string | null;
  /** The registered seat (székhely). */
  seat: string | null;
  /** Cégjegyzékszám. */
  registrationNumber: string | null;
  /** The court of registration (cégbíróság), which follows from the seat. */
  registryCourt: string | null;
  /** Adószám. */
  taxNumber: string | null;
  email: string;
}

export const COMPANY: Company = {
  name: "LineiQ Kft.",
  legalName: null,
  seat: null,
  registrationNumber: null,
  registryCourt: null,
  taxNumber: null,
  email: "hello@lineiqgroup.com",
};

/** The host, which the Eker. tv. 4. § also asks for. Checked 2026-10-25: the
 *  site answers with `Server: Vercel`, and the address is Vercel's privacy
 *  policy's. */
export const HOST = {
  name: "Vercel Inc.",
  address: "440 N Barranca Avenue #4133, Covina, CA 91723, USA",
  email: "privacy@vercel.com",
} as const;
