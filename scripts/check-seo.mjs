// SEO check (Lineiq-Website#9): reads /sitemap.xml from a running build, then
// opens every page it lists in headless Chromium and checks the head against
// it. Per page: <html lang> is the page's locale, the canonical is the page's
// own address, the hreflang set is en, hu, de and x-default and the same set
// the sitemap gives, og:url and og:locale agree. Then the private routes: none
// in the sitemap, none with a canonical or an hreflang. Then the blackout:
// while robots.txt disallows the host, every page carries noindex, and
// robots.txt names no sitemap.
//
// JavaScript is off: a crawler reads the head as the server sends it.
//
//   npm run build && npx next start -p 3417
//   node scripts/check-seo.mjs http://localhost:3417
import { chromium } from "file:///C:/Users/chris/.claude/skills/web-rip/node_modules/playwright/index.mjs";

const BASE = (process.argv[2] || "http://localhost:3417").replace(/\/$/, "");
const LOCALES = ["en", "hu", "de"];
const HREFLANGS = [...LOCALES, "x-default"].sort();
const OG_LOCALES = { en: "en_US", hu: "hu_HU", de: "de_DE" };
const PRIVATE_ROUTES = ["/styleguide"];

const failures = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);

const browser = await chromium.launch();
const context = await browser.newContext({ javaScriptEnabled: false });
const page = await context.newPage();

// --- The sitemap --------------------------------------------------------------
const sitemapXml = await (await context.request.get(`${BASE}/sitemap.xml`)).text();
const entries = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
  loc: body.match(/<loc>([^<]+)<\/loc>/)[1],
  languages: Object.fromEntries(
    [...body.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(([, l, h]) => [l, h])
  ),
}));
if (entries.length === 0) fail("sitemap", "no entries");
const site = new URL(entries[0].loc).origin;
const pathOf = (url) => new URL(url).pathname;
const local = (url) => BASE + pathOf(url);
const localeOf = (url) => {
  const first = pathOf(url).split("/")[1];
  return LOCALES.includes(first) ? first : "en";
};

const locs = entries.map((e) => e.loc);
if (new Set(locs).size !== locs.length) fail("sitemap", "a URL is listed twice");
if (locs.length % LOCALES.length !== 0) fail("sitemap", `${locs.length} entries is not pages × 3`);
for (const entry of entries) {
  const langs = Object.keys(entry.languages).sort();
  if (langs.join() !== HREFLANGS.join()) fail(entry.loc, `sitemap hreflang set is ${langs}`);
  if (!Object.values(entry.languages).includes(entry.loc)) fail(entry.loc, "sitemap set omits the entry itself");
  if (entry.languages["x-default"] !== entry.languages.en) fail(entry.loc, "x-default is not the English");
}
for (const route of PRIVATE_ROUTES) {
  if (locs.some((loc) => pathOf(loc) === route || pathOf(loc).startsWith(`${route}/`)))
    fail("sitemap", `lists the private route ${route}`);
}

// --- The blackout -------------------------------------------------------------
const robotsTxt = await (await context.request.get(`${BASE}/robots.txt`)).text();
const blackout = /^Disallow: \/\s*$/m.test(robotsTxt);
if (blackout && /^Sitemap:/m.test(robotsTxt)) fail("robots.txt", "names the sitemap during the blackout");

async function readHead(url) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  const head = await page.evaluate(() => {
    const attr = (sel, a) => document.querySelector(sel)?.getAttribute(a) ?? null;
    return {
      lang: document.documentElement.lang,
      title: document.title,
      canonical: attr('link[rel="canonical"]', "href"),
      hreflang: Object.fromEntries(
        [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [
          l.getAttribute("hreflang"),
          l.getAttribute("href"),
        ])
      ),
      robots: attr('meta[name="robots"]', "content"),
      description: attr('meta[name="description"]', "content"),
      ogUrl: attr('meta[property="og:url"]', "content"),
      ogLocale: attr('meta[property="og:locale"]', "content"),
      ogTitle: attr('meta[property="og:title"]', "content"),
    };
  });
  return { status: response?.status(), ...head };
}

// --- Every page in the sitemap ------------------------------------------------
const rows = [];
for (const entry of entries) {
  const head = await readHead(local(entry.loc));
  const where = pathOf(entry.loc);
  const locale = localeOf(entry.loc);
  if (head.status !== 200) fail(where, `status ${head.status}`);
  if (head.lang !== locale) fail(where, `<html lang="${head.lang}">, expected ${locale}`);
  if (head.canonical !== entry.loc) fail(where, `canonical ${head.canonical}`);
  const langs = Object.keys(head.hreflang).sort();
  if (langs.join() !== HREFLANGS.join()) fail(where, `hreflang set is ${langs}`);
  for (const lang of HREFLANGS) {
    if (head.hreflang[lang] !== entry.languages[lang])
      fail(where, `hreflang ${lang} is ${head.hreflang[lang]}, sitemap says ${entry.languages[lang]}`);
  }
  if (!head.title || !head.description) fail(where, "no title or description");
  if (head.ogTitle !== head.title) fail(where, "og:title differs from the title");
  if (head.ogUrl !== head.canonical) fail(where, `og:url ${head.ogUrl}`);
  if (head.ogLocale !== OG_LOCALES[locale]) fail(where, `og:locale ${head.ogLocale}`);
  if (blackout && head.robots !== "noindex, nofollow") fail(where, `robots meta "${head.robots}" during the blackout`);
  rows.push({ path: where, lang: head.lang, hreflang: langs.length, canonical: head.canonical === entry.loc ? "own" : head.canonical, robots: head.robots, title: head.title });
}

// --- The private routes -------------------------------------------------------
for (const route of PRIVATE_ROUTES) {
  const head = await readHead(BASE + route);
  if (head.canonical) fail(route, `has a canonical ${head.canonical}`);
  if (Object.keys(head.hreflang).length) fail(route, "has an hreflang set");
  if (head.robots !== "noindex, nofollow") fail(route, `robots meta "${head.robots}"`);
  rows.push({ path: route, lang: head.lang, hreflang: 0, canonical: head.canonical ?? "none", robots: head.robots, title: head.title });
}

await browser.close();

console.table(rows);
console.log(`${site}: ${entries.length} sitemap entries, ${rows.length} pages read, blackout ${blackout ? "on" : "off"}.`);
if (failures.length) {
  console.error(`\n${failures.length} failure(s):\n` + failures.map((f) => `  ${f}`).join("\n"));
  process.exit(1);
}
console.log("All complete.");
