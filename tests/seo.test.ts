import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  metadataFor,
  pageMetadata,
  sitemapEntries,
  visitorPaths,
} from "@/app/i18n/seo";
import { dictionaries } from "@/app/i18n/dictionary";
import { locales } from "@/app/i18n/routing";
import { PRIVATE_ROUTES, SITE_URL } from "@/app/data/site";
import { services } from "@/app/data/services";

const text = { title: "T", description: "D" };

describe("a page's metadata", () => {
  it("declares every language version and x-default, as full URLs", () => {
    expect(pageMetadata("hu", "/about", text).alternates).toEqual({
      canonical: `${SITE_URL}/hu/about`,
      languages: {
        en: `${SITE_URL}/about`,
        hu: `${SITE_URL}/hu/about`,
        de: `${SITE_URL}/de/about`,
        "x-default": `${SITE_URL}/about`,
      },
    });
  });

  it("is canonical to its own locale", () => {
    for (const locale of locales) {
      const { alternates } = pageMetadata(locale, "/contact", text);
      expect(alternates?.canonical).toBe(
        (alternates?.languages as Record<string, string>)[locale]
      );
    }
  });

  it("puts the home page at the bare host and the bare prefix", () => {
    expect(pageMetadata("en", "/", text).alternates?.canonical).toBe(SITE_URL);
    expect(pageMetadata("de", "/", text).alternates?.canonical).toBe(
      `${SITE_URL}/de`
    );
  });

  it("is the same set from every language version of a path", () => {
    expect(pageMetadata("en", "/de/work", text).alternates).toEqual(
      pageMetadata("en", "/work", text).alternates
    );
  });

  it("gives the link preview the page's text, URL and language", () => {
    expect(pageMetadata("de", "/about", text).openGraph).toEqual({
      type: "website",
      siteName: "LineiQ",
      title: "T",
      description: "D",
      url: `${SITE_URL}/de/about`,
      locale: "de_DE",
      alternateLocale: ["en_US", "hu_HU"],
    });
  });

  it("gives a private route its text and no language versions", () => {
    expect(pageMetadata("en", "/styleguide", text)).toEqual(text);
  });

  it("needs nothing from a page the site has never had", () => {
    // A throwaway path: the full set comes from the path alone.
    const meta = pageMetadata("hu", "/a-page-added-tomorrow", text);
    expect(meta.alternates?.canonical).toBe(
      `${SITE_URL}/hu/a-page-added-tomorrow`
    );
    expect(Object.keys(meta.alternates?.languages ?? {}).sort()).toEqual(
      ["de", "en", "hu", "x-default"]
    );
  });
});

describe("metadataFor", () => {
  it("reads the page's text from its locale's dictionary", async () => {
    const meta = await metadataFor("/about")({
      params: Promise.resolve({ locale: "hu" }),
    });
    expect(meta.title).toBe(dictionaries.hu.meta.pages["/about"].title);
    expect(meta.description).toBe(
      dictionaries.hu.meta.pages["/about"].description
    );
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/hu/about`);
  });

  it("gives nothing for a segment that is not a locale", async () => {
    expect(
      await metadataFor("/about")({ params: Promise.resolve({ locale: "fr" }) })
    ).toEqual({});
  });
});

describe("the sitemap", () => {
  const entries = sitemapEntries(visitorPaths());
  const urls = entries.map((e) => e.url);

  it("lists every page in every locale, once", () => {
    expect(urls).toHaveLength(visitorPaths().length * locales.length);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toContain(SITE_URL);
    expect(urls).toContain(`${SITE_URL}/hu`);
    expect(urls).toContain(`${SITE_URL}/de/about`);
    for (const s of services) {
      expect(urls).toContain(`${SITE_URL}/hu/services/${s.slug}`);
    }
  });

  it("gives every entry its full hreflang set, which contains the entry", () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages as Record<string, string>;
      expect(Object.keys(languages).sort()).toEqual(
        ["de", "en", "hu", "x-default"]
      );
      expect(Object.values(languages)).toContain(entry.url);
    }
  });

  it("has no private route", () => {
    for (const route of PRIVATE_ROUTES) {
      expect(urls.some((url) => url.startsWith(absoluteUrl(route)))).toBe(
        false
      );
    }
    expect(sitemapEntries(["/styleguide"])).toEqual([]);
  });

  it("puts a page added to meta.pages in the sitemap", () => {
    expect(visitorPaths()).toEqual(
      expect.arrayContaining(Object.keys(dictionaries.en.meta.pages))
    );
  });
});

// The safety net under "a new page needs no extra wiring": every page file
// under [locale] is a page the sitemap lists, and declares its metadata.
describe("every page under [locale]", () => {
  const root = join(process.cwd(), "src", "app", "[locale]");

  function pageFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return pageFiles(path);
      return entry.name === "page.tsx" ? [path] : [];
    });
  }

  /** "services/[slug]/page.tsx" → /^\/services\/[^/]+$/ */
  function routePattern(file: string): RegExp {
    const segments = relative(root, file).split(sep).slice(0, -1);
    const source = segments
      .map((s) => (s.startsWith("[") ? "[^/]+" : s))
      .join("\\/");
    return new RegExp(`^\\/${source}$`);
  }

  // The 404 catch-all is not a page anyone links to.
  const pages = pageFiles(root).filter((f) => !f.includes("[..."));

  it("finds the pages", () => {
    expect(pages.length).toBeGreaterThanOrEqual(5);
  });

  it("is in the sitemap", () => {
    const paths = visitorPaths();
    for (const file of pages) {
      const pattern = routePattern(file);
      expect(
        paths.some((p) => pattern.test(p)),
        `${relative(root, file)} has no sitemap entry: add it to meta.pages`
      ).toBe(true);
    }
  });

  it("declares its metadata through the SEO layer", () => {
    for (const file of pages) {
      expect(
        /export (const|async function) generateMetadata/.test(
          readFileSync(file, "utf8")
        ),
        `${relative(root, file)} exports no generateMetadata`
      ).toBe(true);
    }
  });
});
