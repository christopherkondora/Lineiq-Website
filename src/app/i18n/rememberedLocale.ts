// The remembered language (Lineiq-Website#5). Choosing a language in the
// switcher stores it in one first-party cookie; the proxy reads it back and
// sends a plain address to the same page in that language. Strictly
// functional: it holds a locale code and nothing else, so it needs no consent.
// The privacy notice names it (Lineiq-Website#14).
//
// There is no Accept-Language sniffing. A visitor without the cookie, and
// every crawler, gets English at the plain address.

import { isLocale, type Locale } from "./routing";

export const LOCALE_COOKIE = "lineiq-locale";

/** A year, in seconds: long enough to outlast a gap between visits. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** The cookie's value as a locale, or null when it is missing or not ours. */
export function rememberedLocale(value: string | undefined): Locale | null {
  return value !== undefined && isLocale(value) ? value : null;
}

/**
 * The `document.cookie` assignment that remembers a locale. Lax, so it rides
 * along when a visitor follows a link to the site; Secure wherever the page is
 * served over https.
 */
export function localeCookie(locale: Locale, secure: boolean): string {
  const parts = [
    `${LOCALE_COOKIE}=${locale}`,
    "Path=/",
    `Max-Age=${LOCALE_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}
