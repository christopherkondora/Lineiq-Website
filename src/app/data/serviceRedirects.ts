// Retired category slugs and the live category each one now lives in. Read by
// next.config.ts, which turns every entry into a permanent (308) redirect, so
// an old link lands on the current page instead of a 404.
//
// The taxonomy moved to Service Delivery's five categories on 2026-10-16
// (Lineiq-Website#2): Brand building was renamed, Mobile apps merged into
// Software Solutions, Marketing became Strategic Marketing.

import { locales, localizePath } from "../i18n/routing";

export const serviceRedirects: Record<string, string> = {
  "brand-building": "brand-architecture",
  "mobile-apps": "software-solutions",
  marketing: "strategic-marketing",
};

/** Every old slug in every language: /services/x, /hu/services/x, /de/services/x. */
export function serviceRedirectRules() {
  return locales.flatMap((locale) =>
    Object.entries(serviceRedirects).map(([from, to]) => ({
      source: localizePath(`/services/${from}`, locale),
      destination: localizePath(`/services/${to}`, locale),
      permanent: true,
    }))
  );
}
