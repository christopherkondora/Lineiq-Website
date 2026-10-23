import type { Metadata, MetadataRoute } from "next";
import { SITE_URL } from "../data/site";
import { services } from "../data/services";
import { getDictionary, dictionaries, type Dictionary } from "./dictionary";
import { alternates, isLocale, locales, type Locale } from "./routing";

// The SEO layer: what search engines and link previews read about a page. The
// addresses all come from the routing core's alternates set, so the canonical,
// the hreflang tags and the sitemap cannot disagree with the links on the page
// (Lineiq-Website#9). The blackout is not here: robots stays with
// SITE_INDEXABLE in data/site, read by RootDocument and robots.ts.

/** Open Graph names a territory as well as a language. */
const ogLocales: Record<Locale, string> = {
  en: "en_US",
  hu: "hu_HU",
  de: "de_DE",
};

/** A site path as the full URL search engines are given. */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/** The hreflang set as full URLs: en, hu, de and x-default. */
function hreflangSet(path: string): Record<string, string> | null {
  const set = alternates(path);
  if (!set) return null;
  return Object.fromEntries(
    Object.entries(set).map(([lang, href]) => [lang, absoluteUrl(href)])
  );
}

export type PageText = { title: string; description: string };

/**
 * A page's metadata in one locale: its title and description, the same text
 * for the link preview, the canonical (the page's own address in this locale)
 * and the hreflang set. Accepts the path in any locale. A private route gets
 * its text only: it exists once and has no language versions to declare.
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description }: PageText
): Metadata {
  const languages = hreflangSet(path);
  if (!languages) return { title, description };
  const url = languages[locale];
  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      siteName: "LineiQ",
      title,
      description,
      url,
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((other) => other !== locale)
        .map((other) => ogLocales[other]),
    },
  };
}

/** A page the dictionaries title, by its English path. */
export type PagePath = keyof Dictionary["meta"]["pages"];

/**
 * A page's generateMetadata, from its entry in the dictionaries' meta.pages.
 * This and that entry are all a new page needs: the hreflang set, the
 * canonical and the sitemap entry follow from them.
 *
 *   export const generateMetadata = metadataFor("/about");
 */
export function metadataFor(path: PagePath) {
  return async ({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> => {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    return pageMetadata(locale, path, getDictionary(locale).meta.pages[path]);
  };
}

/**
 * Every visitor page, by its English path: the pages the dictionaries title,
 * and one per service category.
 */
export function visitorPaths(): string[] {
  return [
    ...Object.keys(dictionaries.en.meta.pages),
    ...services.map((s) => `/services/${s.slug}`),
  ];
}

/**
 * The sitemap for a set of pages: one entry per page per locale, each with the
 * page's full hreflang set. Private routes are left out.
 */
export function sitemapEntries(paths: string[]): MetadataRoute.Sitemap {
  return paths.flatMap((path) => {
    const languages = hreflangSet(path);
    if (!languages) return [];
    return locales.map((locale) => ({
      url: languages[locale],
      alternates: { languages },
    }));
  });
}
