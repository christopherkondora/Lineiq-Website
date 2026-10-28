import { describe, expect, it } from "vitest";
import {
  BINDING_LOCALE,
  LEGAL_PATHS,
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
      "Version 1.0 · in force from 25 October 2026"
    );
    expect(legalPage("privacy", "hu").versionLine).toBe(
      "1.0. változat · hatályos: 2026. október 25."
    );
    expect(legalPage("privacy", "de").versionLine).toBe(
      "Version 1.0 · gültig ab 25. Oktober 2026"
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

describe("linkify", () => {
  it("links an email address and leaves the full stop behind", () => {
    expect(linkify("Write to hello@lineiqgroup.com.")).toEqual([
      { text: "Write to " },
      { text: "hello@lineiqgroup.com", href: "mailto:hello@lineiqgroup.com" },
      { text: "." },
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
