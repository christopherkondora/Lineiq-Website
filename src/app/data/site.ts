// Site-wide constants that more than one route needs to agree on.

/** Canonical host. The apex 308s to www, so www is the one we publish. */
export const SITE_URL = "https://www.lineiqgroup.com";

/**
 * The pre-launch blackout, as one switch.
 *
 * The domain went live on 2026-09-25 while /about was still serving the
 * placeholder founder rows ("replace these before this ships") and a stand-in
 * portrait shown twice. Nothing is linked here yet and nothing is indexed, so
 * the cheapest fix is to keep it that way until the launch set is finished:
 * the first thing a search engine learns about this hostname should be the
 * finished site, not the scaffolding.
 *
 * While false: every route ships `noindex`, and robots.txt disallows the whole
 * host. Flip to true on launch day — robots.ts and layout.tsx both read this,
 * so the blackout lifts in one edit and cannot half-lift.
 */
export const SITE_INDEXABLE = false;

/**
 * Routes that stay out of the index even after the blackout lifts. /styleguide
 * and /preloader are working surfaces for us, not pages for a visitor.
 */
export const PRIVATE_ROUTES = ["/styleguide", "/preloader"];
