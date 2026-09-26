// The founders' track record. Created on 2026-09-25, after the About page was
// found claiming that neither founder had ever had a client. That came from
// World.md §3, was never checked with Kristóf, and was false: he partnered with
// Viltor.hu as a marketing and SEO specialist and has two years of client work
// behind him.
//
// Where these facts live, because they were in the vault the whole time and the
// page was written without them:
//   docs/lineiq_fundamentum.md:40  Kristóf's sole-trader client work, Viltor
//   docs/lineiq_fundamentum.md:81  Klient
//   identity/Culture.md:109        who owns what between the two founders
//   identity/Deep Research - Pillar-2/3/4  frontmatter owner: "Aron"
//
// CONSENT. The client names are the strongest fact on the page and the one most
// able to cost a relationship, and part of the work came through Viltor.hu.
// Raised twice on 2026-09-25 and cleared by Kristóf both times, the second time
// as a direct instruction: "You can mention Viltor and the clients, I'm telling
// you." His call, his relationships, and he is the one who holds them. The flag
// stays in place as a kill switch rather than being deleted, so the whole roster
// can come down in one line if Viltor ever objects.
//
// 2026-09-26. The ledger that used to sit under this roster was cut. It held six
// rows of prose (the Viltor partnership, a 10x ROAS figure, a replatformed
// webshop, Kristóf's accounting qualification, Klient and North) and the section
// now answers its own heading with names alone, moving. The facts are not lost:
// they are in the vault at docs/lineiq_fundamentum.md:40 and :81 and in
// identity/Founders.md. If a figure like the ROAS is wanted back on the site it
// belongs in a case study, which is the thing this section admits we do not yet
// have, not in a ledger standing in for one.

/** Cleared by Kristóf on 2026-09-25. Set false to pull the roster off the page
    without touching anything else. */
export const CLIENT_NAMES_CLEARED: boolean = true;

/** The roster. Clients and our own products in one list, which is the claim:
    these are the things we have actually shipped. Names only, and set at
    display size, because the page has no logos and no photographs and these are
    the only proper nouns on it. Kristóf's phrasing for the client side was
    "various clients like", so this is a sample and not a complete list.

    Order is not ranked, and it is the reading order: AboutRecord puts the whole
    list in both marquee lanes and starts the second one halfway down, so this
    array is the sequence a reader actually sees. Alternating long names and
    short ones is what keeps the lane from clumping. */
export const CLIENTS = [
  "Mythos Private Resort",
  "I-Trap",
  "Sealmark",
  "GoldFisch",
  "SzfinxPapír",
  "Viltor",
  "Klient",
  "North",
  "Kontrast",
  "TV Center",
] as const;
