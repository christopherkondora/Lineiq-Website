// The company behind the site, as the law asks it to be named: the footer, the
// terms and the privacy notice all read it from here (Lineiq-Website#14). The
// Eker. tv. 4. § requires a Hungarian site to publish its operator's name,
// seat, registration and tax number, an email address, and its host.
//
// Source: the Szombathelyi Törvényszék Cégbírósága's registration order
// (Cg.18-09-116839/6, 2026-10-21), and the tax number as registered on
// 2026-10-20. Public registry data only: nothing about the founders beyond
// their names and offices belongs in this repo.

export const COMPANY = {
  /** The short name (rövidített cégnév), as registered: no full stop. */
  name: "LineiQ Group Kft",
  /** The full registered name (cégnév). */
  legalName: "LineiQ Group Korlátolt Felelősségű Társaság",
  /** The registered seat (székhely). */
  seat: "9700 Szombathely, Minerva utca 14/A A. ép. Fsz. 3. ajtó",
  /** Cégjegyzékszám. */
  registrationNumber: "18-09-116839",
  /** The court of registration (cégbíróság). */
  registryCourt: "Szombathelyi Törvényszék Cégbírósága",
  /** Adószám. */
  taxNumber: "33149389-1-18",
  /** The studio's mailbox, the one the site prints everywhere. The registry's
   *  delivery address is contact@lineiqgroup.com; this is not that. */
  email: "hello@lineiqgroup.com",
} as const;

/** The host, which the Eker. tv. 4. § also asks for. Checked 2026-10-25: the
 *  site answers with `Server: Vercel`, and the address is Vercel's privacy
 *  policy's. */
export const HOST = {
  name: "Vercel Inc.",
  address: "440 N Barranca Avenue #4133, Covina, CA 91723, USA",
  email: "privacy@vercel.com",
} as const;
