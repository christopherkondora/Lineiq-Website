// Visual diff (Lineiq-Website#12): a change that should not change how the
// site looks is checked against screenshots. `capture` reads /sitemap.xml from
// a running build and saves a full-page screenshot of every page at every
// width, plus the contact flow's first question, where its readout (the Back
// button) shows; `compare` counts the pixels that differ between two captures
// and fails on any screenshot that is not identical.
//
// Reduced motion and frozen CSS animations keep the captures repeatable: with
// motion on, the scroll scenes would be photographed mid-flight.
//
//   npm run build && npx next start -p 3418
//   node scripts/visual-diff.mjs capture http://localhost:3418 .shots/before
//   (make the change, build and start again)
//   node scripts/visual-diff.mjs capture http://localhost:3418 .shots/after
//   node scripts/visual-diff.mjs compare .shots/before .shots/after
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { inflateSync } from "node:zlib";
import { chromium } from "file:///C:/Users/chris/.claude/skills/web-rip/node_modules/playwright/index.mjs";

const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];

const [mode, ...args] = process.argv.slice(2);
if (mode === "capture") await capture(...args);
else if (mode === "compare") await compare(...args);
else {
  console.error("usage: visual-diff.mjs capture <base-url> <dir> | compare <dir-a> <dir-b>");
  process.exit(2);
}

async function capture(baseArg, dir) {
  const base = (baseArg || "http://localhost:3418").replace(/\/$/, "");
  if (!dir) throw new Error("capture needs a target directory");
  await mkdir(dir, { recursive: true });

  const browser = await chromium.launch();
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc).pathname);
  let shots = paths.length * VIEWPORTS.length;

  await Promise.all(
    VIEWPORTS.map(async (viewport) => {
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      const page = await context.newPage();
      for (const path of paths) {
        // The pointer stays where the last click left it, which would hover
        // whatever the next page puts there.
        await page.mouse.move(0, 0);
        await page.goto(base + path, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(800);
        const file = join(dir, `${slug(path)}@${viewport.width}.png`);
        await page.screenshot({ path: file, fullPage: true, animations: "disabled", caret: "hide" });

        if (path.endsWith("/contact")) {
          await page.locator('[data-active="true"] button[type="submit"]').click();
          await page.locator('[data-panel="1"][data-active="true"]').waitFor({ timeout: 5000 });
          await page.mouse.move(0, 0);
          await page.waitForTimeout(800);
          const step = join(dir, `${slug(path)}-panel1@${viewport.width}.png`);
          await page.screenshot({ path: step, animations: "disabled", caret: "hide" });
          shots++;
        }
      }
      await context.close();
    })
  );
  await browser.close();
  console.log(`${shots} screenshots in ${dir}`);
}

async function compare(dirA, dirB) {
  if (!dirA || !dirB) throw new Error("compare needs two directories");
  const files = (await readdir(dirA)).filter((f) => f.endsWith(".png")).sort();
  const failures = [];

  for (const file of files) {
    const a = await readFile(join(dirA, file));
    const b = await readFile(join(dirB, file)).catch(() => null);
    if (!b) {
      failures.push(`${file}: missing in ${dirB}`);
      continue;
    }
    if (a.equals(b)) continue;
    // Byte-different PNGs can still hold the same pixels: decode and count.
    const x = decodePng(a);
    const y = decodePng(b);
    if (x.width !== y.width || x.height !== y.height) {
      failures.push(`${file}: size differs, ${x.width}x${x.height} vs ${y.width}x${y.height}`);
      continue;
    }
    let diff = 0;
    let top = Infinity;
    let bottom = -1;
    for (let row = 0; row < x.height; row++) {
      const start = row * x.stride;
      const rowA = x.pixels.subarray(start, start + x.stride);
      const rowB = y.pixels.subarray(start, start + y.stride);
      if (rowA.equals(rowB)) continue;
      for (let i = 0; i < x.stride; i += x.bpp) {
        if (!rowA.subarray(i, i + x.bpp).equals(rowB.subarray(i, i + x.bpp))) diff++;
      }
      top = Math.min(top, row);
      bottom = row;
    }
    if (diff) failures.push(`${file}: ${diff} pixels differ, rows ${top}-${bottom}`);
  }

  if (failures.length) {
    console.error(`${failures.length} of ${files.length} screenshots differ:\n  ${failures.join("\n  ")}`);
    await writeFile(join(dirB, "diff.txt"), failures.join("\n") + "\n");
    process.exit(1);
  }
  console.log(`${files.length} screenshots, all identical`);
}

// The PNGs Chromium writes: 8-bit RGB or RGBA, not interlaced. Returns the
// unfiltered scanlines.
function decodePng(buf) {
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const [depth, colorType, , , interlace] = buf.subarray(24, 29);
  const bpp = { 2: 3, 6: 4 }[colorType];
  if (depth !== 8 || !bpp || interlace) throw new Error(`unsupported PNG: depth ${depth}, color ${colorType}`);

  const idat = [];
  for (let at = 8; at < buf.length; ) {
    const length = buf.readUInt32BE(at);
    const type = buf.toString("latin1", at + 4, at + 8);
    if (type === "IDAT") idat.push(buf.subarray(at + 8, at + 8 + length));
    at += length + 12;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * bpp;
  const pixels = Buffer.alloc(stride * height);
  for (let row = 0; row < height; row++) {
    const filter = raw[row * (stride + 1)];
    const src = raw.subarray(row * (stride + 1) + 1, (row + 1) * (stride + 1));
    const out = pixels.subarray(row * stride, (row + 1) * stride);
    const up = row ? pixels.subarray((row - 1) * stride, row * stride) : null;
    for (let i = 0; i < stride; i++) {
      const left = i >= bpp ? out[i - bpp] : 0;
      const above = up ? up[i] : 0;
      const corner = up && i >= bpp ? up[i - bpp] : 0;
      let value = src[i];
      if (filter === 1) value += left;
      else if (filter === 2) value += above;
      else if (filter === 3) value += (left + above) >> 1;
      else if (filter === 4) {
        const p = left + above - corner;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - above);
        const pc = Math.abs(p - corner);
        value += pa <= pb && pa <= pc ? left : pb <= pc ? above : corner;
      }
      out[i] = value & 0xff;
    }
  }
  return { width, height, bpp, stride, pixels };
}

function slug(path) {
  return path.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "home";
}
