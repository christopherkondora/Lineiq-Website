import { describe, expect, it } from "vitest";
import {
  BINDING_LOCALE,
  LEGAL_PATHS,
  emphasize,
  keepTogether,
  formatLegalDate,
  legalPage,
  legalTexts,
  linkify,
  type LegalBlock,
  type LegalKind,
} from "@/app/data/legal";
import { COMPANY } from "@/app/data/company";
import { FOOTER_LEGAL_LINKS } from "@/app/data/footer";
import { dictionaries } from "@/app/i18n/dictionary";
import { locales } from "@/app/i18n/routing";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
} from "@/app/i18n/rememberedLocale";
import { visitorPaths } from "@/app/i18n/seo";

const kinds: LegalKind[] = ["terms", "privacy"];

/** A block's shape without its words: what a translation must keep. */
function shape(block: LegalBlock): string {
  if (typeof block === "string") return "p";
  if ("list" in block) return `list:${block.list.length}`;
  return `facts:${block.facts.length}`;
}

function allText(kind: LegalKind, locale: (typeof locales)[number]): string {
  return legalTexts[locale][kind].sections
    .flatMap((s) => [
      s.heading,
      ...s.blocks.flatMap((b) =>
        typeof b === "string"
          ? [b]
          : "list" in b
            ? b.list
            : b.facts.flat()
      ),
    ])
    .join("\n");
}

describe("the legal documents", () => {
  it.each(kinds)(
    "%s: every translation follows the Hungarian block for block",
    (kind) => {
      const binding = legalTexts[BINDING_LOCALE][kind].sections.map((s) =>
        s.blocks.map(shape)
      );
      for (const locale of locales) {
        const sections = legalTexts[locale][kind].sections.map((s) =>
          s.blocks.map(shape)
        );
        expect(sections, locale).toEqual(binding);
      }
    }
  );

  it.each(locales)("the privacy notice in %s names the language cookie", (locale) => {
    expect(allText("privacy", locale)).toContain(LOCALE_COOKIE);
  });

  it.each(locales)("%s names the company as the registry does, in both documents", (locale) => {
    for (const kind of kinds) {
      const text = allText(kind, locale);
      for (const fact of [
        COMPANY.legalName,
        COMPANY.seat,
        COMPANY.registrationNumber,
        COMPANY.taxNumber,
      ]) {
        expect(text, `${kind}: ${fact}`).toContain(fact);
      }
    }
  });

  it.each(locales)("the privacy notice in %s has the notice's eighteen sections, and the objection right in bold", (locale) => {
    const { sections } = legalTexts[locale].privacy;
    expect(sections).toHaveLength(18);
    // Article 21(4): the right to object to marketing contact is set apart.
    expect(sections[4].blocks.some((b) => typeof b === "string" && b.startsWith("**"))).toBe(true);
  });

  it.each(locales)("the privacy notice in %s sends requests to contact@, not the studio mailbox", (locale) => {
    const text = allText("privacy", locale);
    expect(text).toContain("contact@lineiqgroup.com");
    // The company block still prints the studio mailbox; the requests do not go there.
    const { sections } = legalTexts[locale].privacy;
    const rights = JSON.stringify(sections[14]);
    expect(rights).toContain("contact@lineiqgroup.com");
    expect(rights).not.toContain(COMPANY.email);
  });

  it.each(locales)("the privacy notice in %s lists every processor, with no bold mark left open", (locale) => {
    const text = allText("privacy", locale);
    for (const processor of ["Proton", "Supabase", "Tally", "Adobe", "Vercel", "Resend", "GitHub", "Anthropic"]) {
      expect(text, processor).toContain(processor);
    }
    expect((text.match(/\*\*/g) ?? []).length % 2, "** marks come in pairs").toBe(0);
    expect(text).not.toMatch(/\{company\}/);
  });

  it("the cookie lives as long as the notice says: one year", () => {
    expect(LOCALE_COOKIE_MAX_AGE).toBe(365 * 24 * 60 * 60);
  });

  it.each(locales)("%s says the Hungarian prevails, in both documents", (locale) => {
    for (const kind of kinds) {
      expect(allText(kind, locale)).toMatch(/magyar|Hungarian|ungarisch/i);
    }
  });
});

describe("a legal page", () => {
  it.each(kinds)("%s in Hungarian is the original: no link to itself", (kind) => {
    const page = legalPage(kind, "hu");
    expect(page.original).toBeNull();
    expect(page.languageNote).toMatch(/kötelező erejű/);
  });

  it.each(kinds)("%s in English and German links to the Hungarian", (kind) => {
    expect(legalPage(kind, "en").original?.href).toBe(`/hu${LEGAL_PATHS[kind]}`);
    expect(legalPage(kind, "de").original?.href).toBe(`/hu${LEGAL_PATHS[kind]}`);
    expect(legalPage(kind, "en").languageNote).toMatch(/Hungarian text is the binding one/);
    expect(legalPage(kind, "de").languageNote).toMatch(/Verbindlich ist der ungarische Text/);
  });

  it("states the same version and date in each language's own words", () => {
    expect(legalPage("privacy", "en").versionLine).toBe(
      "Version 2.0 · in force from 7 November 2026"
    );
    expect(legalPage("privacy", "hu").versionLine).toBe(
      "2.0. változat · hatályos: 2026. november 7."
    );
    expect(legalPage("privacy", "de").versionLine).toBe(
      "Version 2.0 · gültig ab 7. November 2026"
    );
  });

  it.each(locales)("%s titles the page as the document does", (locale) => {
    for (const kind of kinds) {
      const meta = dictionaries[locale].meta.pages[LEGAL_PATHS[kind]];
      expect(meta.title).toBe(`${legalTexts[locale][kind].title} | LineiQ`);
      expect(meta.description).toBeTruthy();
    }
  });
});

describe("the footer's legal links", () => {
  it("point at the legal pages, which are in the sitemap", () => {
    expect(FOOTER_LEGAL_LINKS.map((l) => l.href)).toEqual(
      Object.values(LEGAL_PATHS)
    );
    for (const path of Object.values(LEGAL_PATHS)) {
      expect(visitorPaths()).toContain(path);
    }
  });
});

describe("formatLegalDate", () => {
  it("writes a date the way each language does", () => {
    expect(formatLegalDate("2026-01-05", "en")).toBe("5 January 2026");
    expect(formatLegalDate("2026-01-05", "hu")).toBe("2026. január 5.");
    expect(formatLegalDate("2026-01-05", "de")).toBe("5. Januar 2026");
  });
});

describe("emphasize", () => {
  it("cuts a paragraph at its bold marks", () => {
    expect(emphasize("A **b** c")).toEqual([
      { text: "A ", bold: false },
      { text: "b", bold: true },
      { text: " c", bold: false },
    ]);
  });

  it("leaves a paragraph without marks whole", () => {
    expect(emphasize("Plain.")).toEqual([{ text: "Plain.", bold: false }]);
  });

  it("starts with the bold piece when the paragraph does", () => {
    expect(emphasize("**Objection.** Always.")).toEqual([
      { text: "Objection.", bold: true },
      { text: " Always.", bold: false },
    ]);
  });
});

describe("keepTogether", () => {
  it("joins an en-dash pair and a chain of bracketed references", () => {
    expect(keepTogether("EU–USA")).toBe("EU–⁠USA");
    expect(keepTogether("Article 6(1)(f) and 9–11.")).toBe(
      "Article 6(1)⁠(f) and 9–⁠11."
    );
  });

  it("leaves a dash between spaces and ordinary text alone", () => {
    expect(keepTogether("one – two")).toBe("one – two");
    expect(keepTogether("Plain (text).")).toBe("Plain (text).");
  });
});

describe("linkify", () => {
  it("links an email address and leaves the full stop behind", () => {
    expect(linkify("Write to hello@lineiqgroup.com.")).toEqual([
      { text: "Write to " },
      { text: "hello@lineiqgroup.com", href: "mailto:hello@lineiqgroup.com" },
      { text: "." },
    ]);
  });

  it("links a labelled address under its label, and does not show the address", () => {
    expect(
      linkify("See [the addendum](https://example.com/a_very_long_path), then stop.")
    ).toEqual([
      { text: "See " },
      { text: "the addendum", href: "https://example.com/a_very_long_path" },
      { text: ", then stop." },
    ]);
  });

  it("links a www address over https", () => {
    expect(linkify("www.naih.hu")).toEqual([
      { text: "www.naih.hu", href: "https://www.naih.hu" },
    ]);
  });

  it("leaves a sentence without an address alone", () => {
    expect(linkify("Nothing to link here.")).toEqual([
      { text: "Nothing to link here." },
    ]);
  });

  it("does not take a closing bracket or semicolon into the address", () => {
    expect(linkify("(privacy@vercel.com; x)")[1]).toEqual({
      text: "privacy@vercel.com",
      href: "mailto:privacy@vercel.com",
    });
  });
});
