// Turns the raw Gemini renders in ../gemini-images into the site's WebP files.
//
//   node scripts/process-gemini-images.mjs
//
// Each image is taken to black and white except its deep red, the way
// public/work/studio.jpg keeps one red object: a pixel keeps its colour in
// proportion to how strongly red it is, everything else goes to luminance.
// Then it is cropped to its slot (3:4 portrait or 16:9 wide), resized and
// written as WebP into public/, with its prompt log copied beside it.
import sharp from "sharp";
import { readdir, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.resolve(ROOT, "..", "gemini-images");

// raw name -> public path (without extension). One photograph per page: the
// wide band on each category page, the Beliefs opener on About. Thirteen
// were rendered on 2026-11-11 (a portrait per category, a plumb line under
// the Beliefs heading, a doorway on the Home partners stage); the seven
// without a job on the page were cut the next day and are not listed here.
const SLOTS = {
  "brand-architecture-wide": "services/brand-architecture-wide",
  "web-development-wide": "services/web-development-wide",
  "ecommerce-wide": "services/ecommerce-wide",
  "software-solutions-wide": "services/software-solutions-wide",
  "strategic-marketing-wide": "services/strategic-marketing-wide",
  "origin-wide": "about/origin-wide",
};

const SIZE = { portrait: [1200, 1600], wide: [2400, 1350] };

/** How red a pixel is, 0..1: a red-dominant hue with real saturation. */
function redness(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max !== r || max - min < 28) return 0;
  const sat = (max - min) / max;
  const hueOk = g - b < 40 && b - g < 60; // excludes orange/yellow and magenta
  if (!hueOk) return 0;
  return Math.min(1, Math.max(0, (sat - 0.25) / 0.3));
}

async function selectiveMono(file) {
  const { data, info } = await sharp(file)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const y = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    const k = redness(r, g, b);
    data[i] = Math.round(y + (r - y) * k);
    data[i + 1] = Math.round(y + (g - y) * k);
    data[i + 2] = Math.round(y + (b - y) * k);
  }
  return sharp(data, { raw: info });
}

const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g)$/i.test(f));
for (const f of files) {
  const name = f.replace(/\.(png|jpe?g)$/i, "");
  const slot = SLOTS[name];
  if (!slot) continue;
  const [w, h] = SIZE[name.endsWith("-wide") ? "wide" : "portrait"];
  const out = path.join(ROOT, "public", slot + ".webp");
  await mkdir(path.dirname(out), { recursive: true });
  const img = await selectiveMono(path.join(SRC, f));
  const info = await img
    .resize(w, h, { fit: "cover", position: "attention" })
    .webp({ quality: 74, effort: 6 })
    .toFile(out);
  await copyFile(path.join(SRC, name + ".log"), out.replace(/\.webp$/, ".log"));
  console.log(`${slot}.webp ${w}x${h} ${(info.size / 1024).toFixed(0)} KB`);
}
