// Responsive check (Lineiq-Website#18): reads /sitemap.xml from a running
// build and opens every page it lists at 320, 375, 768, 1280 and 1920 px, with
// motion and with reduced motion. It scrolls each page a screen at a time and,
// on every screen, looks at the text a visitor would see:
//
// - the page never scrolls sideways;
// - no text runs past the screen's edge or out of a box that clips it;
// - no text is under 12 px;
// - no word is broken across two lines: a word too long for its line is
//   reworded, not hyphenated (the CSS breaks are only a net);
// - with reduced motion, no text sits on the screen invisible (opacity or
//   visibility), waiting for an animation that will not run.
//
// The contact flow is walked panel by panel (the empty-submit error and both
// budget modes included), and the phone menu is opened once per language.
// Widths up to 768 are touch devices: the coarse-pointer styles differ.
//
// With --shots <dir>, it also saves the phone captures: /hu and /de at 375 px,
// motion on, one screenshot per screen, as a visitor scrolls.
//
// Start the server without -H: with it, every plain address 308s to itself
// (see src/proxy.ts).
//
//   npm run build && npx next start -p 3419
//   node scripts/check-responsive.mjs http://localhost:3419
//   node scripts/check-responsive.mjs http://localhost:3419 --shots .shots/phone
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium, devices } from "file:///C:/Users/chris/.claude/skills/web-rip/node_modules/playwright/index.mjs";

const args = process.argv.slice(2);
const shotsAt = args.indexOf("--shots");
const shotsDir = shotsAt >= 0 ? args.splice(shotsAt, 2)[1] : null;
const BASE = (args[0] || "http://localhost:3419").replace(/\/$/, "");

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];
const TOUCH = { isMobile: true, hasTouch: true, userAgent: devices["iPhone 13"].userAgent };
const SETUPS = VIEWPORTS.flatMap((viewport) =>
  ["no-preference", "reduce"].map((reducedMotion) => ({
    name: `${viewport.width}${reducedMotion === "reduce" ? " reduced" : ""}`,
    viewport,
    reducedMotion,
    ...(viewport.width <= 768 ? TOUCH : {}),
  }))
);

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc).pathname);
if (paths.length === 0) {
  console.error(`sitemap: no entries at ${BASE}/sitemap.xml`);
  process.exit(1);
}

const failures = [];
const browser = await chromium.launch();

await Promise.all(
  SETUPS.map(async ({ name, ...options }) => {
    const context = await browser.newContext(options);
    // The contact flow keeps its answers in sessionStorage, so one language's
    // walk would open the next one's flow half answered.
    await context.addInitScript(() => sessionStorage.clear());
    const page = await context.newPage();
    const reduced = options.reducedMotion === "reduce";
    const menuSeen = new Set();
    for (const path of paths) {
      const found = new Map();
      const look = async (where) => {
        for (const problem of await inspect(page, reduced)) {
          if (!found.has(problem)) found.set(problem, where);
        }
      };
      try {
        await open(page, BASE + path);
        await sweep(page, reduced, look, "page");

        if (path.endsWith("/contact")) await walkContact(page, reduced, look);

        const locale = path.split("/")[1];
        const toggle = page.locator("header button[aria-expanded]");
        if (!menuSeen.has(locale) && (await toggle.isVisible())) {
          menuSeen.add(locale);
          await page.evaluate(() => window.scrollTo(0, 0));
          await toggle.click();
          await page.waitForTimeout(1200);
          await look("menu open");
          await toggle.click();
        }
      } catch (error) {
        found.set(`the check itself failed: ${error.message.split("\n")[0]}`, "run");
      }

      for (const [problem, where] of found) failures.push(`${path} @${name} (${where}): ${problem}`);
    }
    await context.close();
  })
);

if (shotsDir) await capturePhone(shotsDir);
await browser.close();

const checked = paths.length * SETUPS.length;
if (failures.length) {
  console.error(`${failures.length} problems on ${checked} page × setup runs:\n  ${failures.sort().join("\n  ")}`);
  process.exit(1);
}
console.log(`${checked} page × setup runs (${paths.length} pages × ${SETUPS.length} setups): no problems`);

async function open(page, url) {
  await page.mouse.move(0, 0);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // The home intro plays before the page is the page.
  await page.waitForTimeout(url.match(/\/(en|hu|de)?\/?$/) ? 3500 : 1200);
}

// One screen at a time, top to bottom. The height is read again on every step:
// pinned sections add their spacers as the page scrolls.
async function sweep(page, reduced, look, where) {
  await page.evaluate(() => window.scrollTo(0, 0));
  for (let step = 0; step < 200; step++) {
    await page.waitForTimeout(reduced ? 150 : 700);
    await look(`${where}, screen ${step + 1}`);
    const moved = await page.evaluate(() => {
      const before = window.scrollY;
      window.scrollTo(0, before + Math.round(window.innerHeight * 0.85));
      return window.scrollY > before;
    });
    if (!moved) break;
  }
}

async function walkContact(page, reduced, look) {
  const settle = () => page.waitForTimeout(reduced ? 300 : 1400);
  const active = (n) => page.locator(`[data-panel="${n}"][data-active="true"]`).waitFor({ timeout: 5000 });
  const inActive = (selector) => page.locator(`[data-active="true"] ${selector}`);

  await page.evaluate(() => window.scrollTo(0, 0));
  await inActive('button[type="submit"]').click();
  await active(1);
  await settle();
  await inActive('button[type="submit"]').click(); // empty: the error shows
  await settle();
  await look("contact, who, error");
  await page.fill("#contact-company", "Kovács és Társa Kereskedelmi Kft.");
  await page.fill("#contact-email", "kapcsolat@kovacs-es-tarsa-kereskedelmi.hu");
  await inActive('button[type="submit"]').click();
  for (const n of [2, 3]) {
    await active(n);
    await settle();
    await look(`contact, panel ${n}`);
    await inActive('[role="group"] button').last().click();
  }
  await active(4);
  await settle();
  await look("contact, budget, monthly");
  await inActive('[role="switch"]').click();
  await settle();
  await look("contact, budget, one-time");
  await inActive('[role="group"] button').last().click();
  await active(5);
  await settle();
  await look("contact, note");
  await page.fill("#contact-note", "Webáruház-fejlesztés és márkaépítés, határidő: tavasz.");
  await inActive('button[type="submit"]').click();
  await active(6);
  await settle();
  await sweep(page, reduced, look, "contact, review");
}

// Runs in the page. Returns one line per problem, so a problem seen on several
// screens is reported once.
function inspect(page, reduced) {
  return page.evaluate((reduced) => {
    const W = document.documentElement.clientWidth;
    const H = window.innerHeight;
    const problems = [];
    const say = (what, el, text) => {
      const tag = el.tagName.toLowerCase() + (el.className && typeof el.className === "string"
        ? "." + el.className.trim().split(/\s+/)[0] : "");
      problems.push(`${what}: <${tag}> "${text.slice(0, 50)}"`);
    };

    const scrollWidth = document.documentElement.scrollWidth;
    if (scrollWidth > W + 1) problems.push(`page scrolls sideways, ${scrollWidth} px in ${W}`);

    const clippers = (el) => {
      const out = [];
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        if (getComputedStyle(a).overflowX !== "visible") out.push(a);
      }
      return out;
    };
    const opacity = (el) => {
      let o = 1;
      for (let a = el; a; a = a.parentElement) o *= parseFloat(getComputedStyle(a).opacity);
      return o;
    };

    const range = document.createRange();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode()); ) {
      const text = node.textContent.replace(/\s+/g, " ").trim();
      if (!text) continue;
      const el = node.parentElement;
      // Not on the screen for anyone: the contact panels the camera is not on,
      // the closed menu, the honeypot.
      if (el.closest('[inert], [role="dialog"][aria-hidden="true"], script, style, noscript')) continue;
      if (!el.checkVisibility({ visibilityProperty: true })) continue;
      range.selectNodeContents(node);
      const rects = [...range.getClientRects()].filter(
        (r) => r.width > 0 && r.bottom > 0 && r.top < H
      );
      if (rects.length === 0) continue;
      const style = getComputedStyle(el);
      // Screen-reader-only text: clipped to a pixel, never seen.
      if (style.clipPath === "inset(50%)" || style.clip === "rect(0px, 0px, 0px, 0px)") continue;

      if (parseFloat(style.fontSize) < 12) say(`text under 12 px (${style.fontSize})`, el, text);

      // A word broken across two lines, by hyphenation or by overflow-wrap.
      // Those rules are only a net against overflow: a word that needs them is
      // reworded. A break after a hyphen the word already has is a line break.
      for (const match of node.textContent.matchAll(/[^\s-]+-?/g)) {
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const tops = new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top)));
        if (tops.size > 1) say(`word broken across lines ("${match[0]}")`, el, text);
      }

      // aria-hidden text is a copy or a decoration of something a reader
      // already has: the hover side of a CtaSwap, the marquee's loop copies,
      // the About display word, the watermark initials. Faded or off the edge
      // on purpose, so only its size is checked.
      if (el.closest('[aria-hidden="true"]')) continue;

      // [data-hidden] is a component hiding a control that has nothing to do
      // yet, as the contact readout on the statement.
      if (reduced && opacity(el) < 0.15 && !el.closest("[data-hidden]"))
        say("invisible with reduced motion", el, text);

      // A masked box fades its own edges: the marquee lanes, where a name
      // running out at the side is the motion.
      if (clippers(el).some((box) => getComputedStyle(box).maskImage !== "none")) continue;

      const left = Math.min(...rects.map((r) => r.left));
      const right = Math.max(...rects.map((r) => r.right));
      if (right <= 0 || left >= W) continue; // wholly off-screen, as a marquee's far end
      if (left < -1 || right > W + 1) say(`text past the screen edge (${Math.round(left)}–${Math.round(right)} in ${W})`, el, text);
      else
        for (const box of clippers(el)) {
          const b = box.getBoundingClientRect();
          if (left < b.left - 1 || right > b.right + 1) {
            say(`text cut by its box (${Math.round(left)}–${Math.round(right)} in ${Math.round(b.left)}–${Math.round(b.right)})`, el, text);
            break;
          }
        }
    }
    return problems;
  }, reduced);
}

async function capturePhone(dir) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, ...TOUCH });
  await context.addInitScript(() => sessionStorage.clear());
  const page = await context.newPage();
  let shots = 0;
  for (const path of paths.filter((p) => /^\/(hu|de)(\/|$)/.test(p))) {
    const folder = join(dir, path.replace(/^\/|\/$/g, "").replace(/\//g, "_"));
    await mkdir(folder, { recursive: true });
    let n = 0;
    const shoot = async () => {
      await page.screenshot({ path: join(folder, `${String(++n).padStart(2, "0")}.png`), caret: "hide" });
      shots++;
    };
    await open(page, BASE + path);
    await sweep(page, false, shoot, "page");
    if (path.endsWith("/contact")) await walkContact(page, false, shoot);
  }
  await context.close();
  console.log(`${shots} phone captures in ${dir}`);
}
