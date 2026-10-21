import { describe, expect, it } from "vitest";
import { FOOTER_LEGAL_LINKS, FOOTER_SITEMAP } from "@/app/data/footer";
import { dictionaries } from "@/app/i18n/dictionary";
import { format } from "@/app/i18n/format";
import { locales } from "@/app/i18n/routing";

describe("the footer", () => {
  it("states the year it is rendered in", () => {
    expect(format(dictionaries.en.footer.copyright, { year: 2027 })).toBe(
      "© 2027 LineiQ. All rights reserved."
    );
  });

  it.each(locales)("names every link in %s", (locale) => {
    const labels = dictionaries[locale].footer.links;
    for (const link of [...FOOTER_SITEMAP, ...FOOTER_LEGAL_LINKS]) {
      expect(labels[link.id], link.href).toBeTruthy();
    }
  });
});
