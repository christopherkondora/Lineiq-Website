// Tap-target check (Lineiq-Website#12): every link and button has at least
// 24 x 24 px of hit area (WCAG 2.2, 2.5.8 Target Size, Minimum). Reads
// /sitemap.xml from a running build and opens every page it lists at 320, 375,
// 768, 1280 and 1920 px: with a mouse at every width, and with touch at the
// three narrow ones, because the coarse-pointer styles lay some targets out
// differently. The menu is checked open as well as closed, and the contact
// flow panel by panel up to its review.
//
// The size of the box alone would mislead: a pseudo-element can widen the hit
// area without growing the element, and a neighbour can cover part of it. So
// the check hit-tests instead of measuring. Each target is scrolled into view
// and elementFromPoint is asked at nine points of a 24 x 24 square centred on
// it; every point has to land on the target itself or inside it.
//
//   npm run build && npx next start -p 3418
//   node scripts/check-tap-targets.mjs http://localhost:3418
//   node scripts/check-tap-targets.mjs http://localhost:3418 /hu/contact
import { chromium, devices } from "file:///C:/Users/chris/.claude/skills/web-rip/node_modules/playwright/index.mjs";

const BASE = (process.argv[2] || "http://localhost:3418").replace(/\/$/, "");
const ONLY = process.argv[3];
const MIN = 24;

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];
const SETUPS = [
  ...VIEWPORTS.map((viewport) => ({ name: `${viewport.width} mouse`, viewport })),
  ...VIEWPORTS.filter((v) => v.width <= 768).map((viewport) => ({
    name: `${viewport.width} touch`,
    viewport,
    isMobile: true,
    hasTouch: true,
    userAgent: devices["iPhone 13"].userAgent,
  })),
];

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(([, loc]) => new URL(loc).pathname)
  .filter((path) => !ONLY || path === ONLY);
if (paths.length === 0) {
  console.error(`no pages to check at ${BASE}/sitemap.xml${ONLY ? ` matching ${ONLY}` : ""}`);
  process.exit(1);
}

const browser = await chromium.launch();
const failures = [];

// Audits one state of a page. A state with no targets at all means the page
// did not reach it (a menu that didn't open), which is a failure too.
async function audit(page, record, state, scope) {
  const { checked, missed } = await page.evaluate(auditTargets, { MIN, scope });
  if (checked === 0) missed.push({ label: "no targets found", where: "-", box: "-", miss: "state not reached" });
  for (const miss of missed) failures.push({ ...record, state, ...miss });
}

await Promise.all(
  SETUPS.map(async ({ name, ...options }) => {
    // Reduced motion: no smooth scrolling and no scroll scenes, so a target
    // scrolled into view stays where it was put.
    const context = await browser.newContext({ ...options, reducedMotion: "reduce" });
    const page = await context.newPage();
    for (const path of paths) {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const record = { path, setup: name };
      await audit(page, record, "page");

      // The contact flow shows one panel at a time and keeps the rest inert,
      // so it is walked to the review, panel by panel. Nothing is sent.
      if (path.endsWith("/contact")) {
        for (let panel = 1; ; panel++) {
          const active = page.locator('[data-panel][data-active="true"]');
          if ((await active.getAttribute("data-kind")) === "review") break;
          for (const input of await active.locator("input").all()) {
            await input.fill((await input.getAttribute("type")) === "email" ? "check@example.com" : "Check");
          }
          const option = active.locator("button[aria-pressed]").first();
          await ((await option.count()) ? option : active.locator('button[type="submit"]')).click();
          await page.locator(`[data-panel="${panel}"][data-active="true"]`).waitFor({ timeout: 5000 });
          await page.waitForTimeout(800); // the camera's travel to the panel
          // The panel on screen, and the readout with the Back button.
          await audit(page, record, `contact ${panel}`, '[data-active="true"], [class*="__hud"]');
        }
      }

      const toggle = page.locator("button[aria-expanded]").first();
      if (await toggle.count()) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await toggle.click();
        await page.waitForTimeout(1500); // the overlay's clip-path and item stagger
        // Only the overlay: the page under it can't be reached, and the toggle
        // was checked with the page.
        await audit(page, record, "menu", '[role="dialog"]');
      }
    }
    await context.close();
  })
);
await browser.close();

const checks = paths.length * SETUPS.length;
if (failures.length === 0) {
  console.log(`${checks} page checks (${paths.length} pages x ${SETUPS.length} setups), every target at least ${MIN}x${MIN}`);
  process.exit(0);
}

// One line per distinct target and setup, with the pages it fails on.
const grouped = new Map();
for (const f of failures) {
  const key = [f.setup, f.state, f.where, f.label, f.box, f.miss].join("|");
  if (!grouped.has(key)) grouped.set(key, { ...f, paths: [] });
  grouped.get(key).paths.push(f.path);
}
console.error(`${failures.length} targets under ${MIN}x${MIN} across ${checks} page checks:\n`);
for (const g of [...grouped.values()].sort((a, b) => a.setup.localeCompare(b.setup) || a.where.localeCompare(b.where))) {
  const on = g.paths.length > 3 ? `${g.paths.length} pages` : g.paths.join(" ");
  console.error(`  ${g.setup.padEnd(10)} ${g.state.padEnd(9)} ${g.box.padEnd(8)} ${g.where.slice(0, 18).padEnd(18)} ${g.miss.padEnd(22)} ${g.label}  (${on})`);
}
process.exit(1);

// Runs in the page: how many visible, operable targets there are (optionally
// only those inside `scope`), and those that fail the hit test.
async function auditTargets({ MIN, scope }) {
  const SELECTOR = 'a[href], button, [role="button"], input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
  const half = MIN / 2 - 0.5;
  const out = [];
  let checked = 0;

  for (const el of document.querySelectorAll(SELECTOR)) {
    if (scope && !el.closest(scope)) continue;
    if (el.disabled || el.closest('[aria-hidden="true"], [inert]')) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.pointerEvents === "none") continue;
    if (el.getClientRects().length === 0) continue; // display: none, or inside it

    el.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    // A link that wraps has one box per line, and the centre of its bounding
    // box can fall between them. Each line is tried; one that holds the whole
    // square is enough.
    const fragments = [...el.getClientRects()].filter((f) => f.width > 0 && f.height > 0);
    if (fragments.length === 0) continue;
    checked++;
    let missed = null;
    for (const f of fragments) {
      const m = probe(el, f.left + f.width / 2, f.top + f.height / 2);
      if (!missed || m.length < missed.length) missed = m;
      if (m.length === 0) break;
    }
    if (missed.length === 0) continue;
    const r = el.getBoundingClientRect();

    const label =
      el.getAttribute("aria-label") ||
      (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 32) ||
      el.getAttribute("name") ||
      `<${el.tagName.toLowerCase()}>`;
    const region = el.closest("section, header, footer, nav, main, form, [role=dialog]");
    const where = region
      ? region.id || (typeof region.className === "string" && region.className.split(/\s+/)[0]) || region.tagName.toLowerCase()
      : "?";
    out.push({
      label,
      where,
      box: `${Math.round(r.width)}x${Math.round(r.height)}`,
      miss: missed.includes("centre") ? "covered" : missed.join(","),
    });
  }
  window.scrollTo(0, 0);
  return { checked, missed: out };

  // The points of the square centred on (cx, cy) that don't land on `el`.
  function probe(el, cx, cy) {
    const points = {
      centre: [cx, cy],
      top: [cx, cy - half],
      bottom: [cx, cy + half],
      left: [cx - half, cy],
      right: [cx + half, cy],
      "top-left": [cx - half, cy - half],
      "top-right": [cx + half, cy - half],
      "bottom-left": [cx - half, cy + half],
      "bottom-right": [cx + half, cy + half],
    };
    const missed = [];
    for (const [name, [x, y]] of Object.entries(points)) {
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
      const hit = document.elementFromPoint(x, y);
      // A label activates its control, so it counts as the control's area.
      if (hit && (el === hit || el.contains(hit) || hit.closest("label")?.control === el)) continue;
      missed.push(name);
    }
    return missed;
  }
}
