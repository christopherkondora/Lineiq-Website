// The language routing core. Every localised address on the site comes from
// here: the proxy, the language switcher, the internal links, and later the
// hreflang set and the sitemap. Nothing else builds a localised URL by hand.
//
// English lives at the plain address (/about), Hungarian and German under a
// prefix (/hu/about, /de/about). /en/... is never a published address: it
// 308s to the plain path, so English has exactly one URL. Slugs stay
// English in every language (Lineiq-Website#4, PRD "The website, done").

import { PRIVATE_ROUTES } from "../data/site";

export const locales = ["en", "hu", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Each language named in its own language, for the switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  hu: "Magyar",
  de: "Deutsch",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Splits "/about?x=1#team" into "/about" and "?x=1#team". */
function splitSuffix(path: string): [string, string] {
  const at = path.search(/[?#]/);
  return at === -1 ? [path, ""] : [path.slice(0, at), path.slice(at)];
}

function firstSegment(pathname: string): string {
  return pathname.split("/")[1] ?? "";
}

/** The locale a path is in. An unprefixed path is English. */
export function localeOf(path: string): Locale {
  const segment = firstSegment(splitSuffix(path)[0]);
  return isLocale(segment) ? segment : defaultLocale;
}

/** The path with its locale prefix removed: "/hu/about" → "/about", "/hu" → "/". */
export function stripLocale(path: string): string {
  const [pathname, suffix] = splitSuffix(path);
  const segment = firstSegment(pathname);
  if (!isLocale(segment)) return path;
  const rest = pathname.slice(segment.length + 1);
  return (rest === "" ? "/" : rest) + suffix;
}

/** Working routes that exist in one language only and are never indexed. */
export function isPrivatePath(path: string): boolean {
  const pathname = splitSuffix(path)[0];
  return PRIVATE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * A path's address in a locale: what the switcher and every internal link
 * point to. Accepts a path in any locale. Private routes and anything that is
 * not a site path (external URLs, mailto:, bare #anchors) come back unchanged.
 */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const bare = stripLocale(path);
  if (isPrivatePath(bare) || locale === defaultLocale) return bare;
  const [pathname, suffix] = splitSuffix(bare);
  return `/${locale}${pathname === "/" ? "" : pathname}${suffix}`;
}

export type Alternates = Record<Locale | "x-default", string>;

/**
 * Every language version of a path, plus x-default (the English). What the
 * hreflang tags, the canonical and the sitemap read. Private routes have no
 * alternates: they exist once and stay out of the index.
 */
export function alternates(path: string): Alternates | null {
  const bare = stripLocale(splitSuffix(path)[0]);
  if (isPrivatePath(bare)) return null;
  const set = {} as Alternates;
  for (const locale of locales) set[locale] = localizePath(bare, locale);
  set["x-default"] = set[defaultLocale];
  return set;
}

/**
 * The /en collapse, as next.config redirects: /en and /en/... 308 to the plain
 * address, so English has one URL. Config redirects run before the proxy, so
 * the proxy never sees an /en path from outside and only ever rewrites.
 */
export function localeRedirectRules() {
  return [
    { source: `/${defaultLocale}`, destination: "/", permanent: true },
    {
      source: `/${defaultLocale}/:path*`,
      destination: "/:path*",
      permanent: true,
    },
  ];
}

export type ProxyDecision = { action: "rewrite"; to: string } | { action: "next" };

/**
 * What the proxy does with a request path. A plain address is served from the
 * internal en segment; anything already in a locale, and the private routes,
 * pass through.
 */
export function routeRequest(pathname: string): ProxyDecision {
  if (isPrivatePath(pathname) || isLocale(firstSegment(pathname))) {
    return { action: "next" };
  }
  return {
    action: "rewrite",
    to: `/${defaultLocale}${pathname === "/" ? "" : pathname}`,
  };
}
