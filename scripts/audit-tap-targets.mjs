// Tap-target audit: mely interaktív elemek maradnak a 44x44 px alatt mobilon.
//
// A méret önmagában félrevezet: a találati felületet pszeudoelem is
// kiterjesztheti anélkül, hogy a horgony doboza nőne. Ezért nem mérünk, hanem
// HIT-TESZTELÜNK — a 44x44-es doboz szélein elementFromPoint-ot hívunk, és azt
// nézzük, a horgonyra (vagy annak leszármazottjára) esik-e a koppintás.
import { chromium, devices } from "file:///C:/Users/chris/.claude/skills/web-rip/node_modules/playwright/index.mjs";

const URL = process.argv[2] || "http://localhost:3000/";
const MIN = 44;

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"], reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

await page.evaluate(async () => {
  const step = window.innerHeight;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(600);

const rows = await page.evaluate((MIN) => {
  const sel = 'a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const out = [];
  for (const el of document.querySelectorAll(sel)) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.bottom < 0 || r.top > window.innerHeight) continue; // hit-teszthez látszania kell
    // Csukott menü-overlay: aria-hidden + pointer-events:none + clip-path. A
    // linkek nagyok, de a hit-teszt rajtuk sosem talál — nem hiba, nem is
    // koppintható most. Nyitott állapotban külön kellene mérni.
    if (el.closest('[aria-hidden="true"]')) continue;

    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const half = MIN / 2;
    // a 44x44-es doboz négy éle, épp befelé egy fél képponttal
    const probes = [
      ["fent", cx, cy - half + 0.5],
      ["lent", cx, cy + half - 0.5],
      ["balra", cx - half + 0.5, cy],
      ["jobbra", cx + half - 0.5, cy],
    ];
    const miss = [];
    for (const [name, x, y] of probes) {
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) continue;
      const hit = document.elementFromPoint(x, y);
      // a horgony maga, vagy bármi ami benne van (pl. a kiterjesztő ::after gazdája)
      if (!hit || !(el === hit || el.contains(hit))) miss.push(name);
    }
    if (miss.length === 0) continue;

    const label = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 30) || el.getAttribute("aria-label") || `<${el.tagName.toLowerCase()}>`;
    const section = el.closest("section, header, footer, nav");
    const where = section ? (section.getAttribute("id") || (typeof section.className === "string" ? section.className.split(/\s+/)[0] : "") || section.tagName.toLowerCase()) : "?";
    out.push({ label, tag: el.tagName.toLowerCase(), where, box: `${Math.round(r.width)}x${Math.round(r.height)}`, miss });
  }
  return out;
}, MIN);

console.log(`\n${rows.length} elem nem tölti ki a ${MIN}x${MIN}-et — ${URL}\n`);
if (rows.length) {
  console.log("  doboz     tag    hely                 hiányzó él        elem");
  console.log("  " + "-".repeat(84));
}
for (const r of rows) {
  console.log(`  ${r.box.padEnd(9)} ${r.tag.padEnd(6)} ${r.where.slice(0, 20).padEnd(20)} ${r.miss.join(",").padEnd(17)} ${r.label}`);
}

await browser.close();
