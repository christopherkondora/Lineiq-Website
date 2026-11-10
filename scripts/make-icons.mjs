// Builds the site's icon set from the two brand logomarks, which live on the
// company Proton Drive (Internal/Branding - LineiQ/Logo), not in this repo:
//
//   node scripts/make-icons.mjs "<folder with logomark-light.png and logomark-dark.png>"
//
// The logomarks are 2828 px squares with the mark floating in a wide margin
// (pure white and pure black grounds, one shared bounding box). An icon cannot
// afford that margin: at 16 px it would leave the mark five pixels tall. So the
// script crops to the mark, scales it to a set fraction of the icon's height,
// and pads with the ground colour of the variant it was cut from.
//
// Writes (all committed, so the build never needs the originals):
//   src/app/favicon.ico            16, 32, 48 px, light ground: the fallback
//   public/icons/apple-touch-icon.png  180 px, dark ground: iOS home screen
//   public/icons/icon-light.png    96 px, for light browser themes
//   public/icons/icon-dark.png     96 px, for dark browser themes
//   public/icons/icon-192.png      192 px, dark: web manifest
//   public/icons/icon-512.png      512 px, dark: web manifest
//   public/icons/icon-maskable-512.png  512 px, dark, mark inside the safe zone
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = process.argv[2];
if (!SRC) {
  console.error('Usage: node scripts/make-icons.mjs "<logo folder>"');
  process.exit(1);
}

// The mark's bounding box in the 2828 px source, identical in both variants
// (measured: pixels that differ from the ground by more than noise).
const BOX = { left: 691, top: 376, width: 1425, height: 1926 };
const GROUND = {
  light: { r: 255, g: 255, b: 255, alpha: 1 },
  dark: { r: 0, g: 0, b: 0, alpha: 1 },
};

const cropCache = {};
async function crop(variant) {
  cropCache[variant] ??= await sharp(
    path.join(SRC, `logomark-${variant}.png`)
  )
    .extract(BOX)
    .toBuffer();
  return cropCache[variant];
}

/** A square icon: the mark at `fill` of the icon's height, centred on its ground. */
async function icon(variant, size, fill) {
  const h = Math.round(size * fill);
  const w = Math.round((h * BOX.width) / BOX.height);
  let mark = await sharp(await crop(variant))
    .resize(w, h, { kernel: "lanczos3" })
    // The hand-drawn strokes are thinner than a pixel at tab sizes and come out
    // pink. A light sharpen plus a contrast lift (the .ico is white-grounded, so
    // the lift darkens the soft edge pixels toward red) keeps the mark solid.
    // Judged by eye at 16 and 32 px against the plain resize.
    .toBuffer();
  if (size <= 48 && variant === "light") {
    mark = await sharp(mark)
      .sharpen({ sigma: 0.7, m1: 1.5, m2: 2 })
      .linear(1.5, -70)
      .toBuffer();
  }
  const top = Math.floor((size - h) / 2);
  const left = Math.floor((size - w) / 2);
  return sharp(mark)
    .extend({
      top,
      bottom: size - h - top,
      left,
      right: size - w - left,
      background: GROUND[variant],
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** An .ico holding PNG images: every current browser reads them. */
function ico(images) {
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, png }, i) => {
    const at = 6 + 16 * i;
    head.writeUInt8(size, at);
    head.writeUInt8(size, at + 1);
    head.writeUInt16LE(1, at + 4); // colour planes
    head.writeUInt16LE(32, at + 6); // bits per pixel
    head.writeUInt32LE(png.length, at + 8);
    head.writeUInt32LE(offset, at + 12);
    offset += png.length;
  });
  return Buffer.concat([head, ...images.map((i) => i.png)]);
}

async function out(file, data) {
  const abs = path.join(ROOT, file);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, data);
  console.log(file.padEnd(40), (data.length / 1024).toFixed(1) + " KB");
}

// Tab sizes keep the mark large (88 %) because a tab icon is judged at 16 px.
const TAB = 0.88;
await out(
  "src/app/favicon.ico",
  ico(
    await Promise.all(
      [16, 32, 48].map(async (size) => ({
        size,
        png: await icon("light", size, TAB),
      }))
    )
  )
);
await out("public/icons/icon-light.png", await icon("light", 96, TAB));
await out("public/icons/icon-dark.png", await icon("dark", 96, TAB));
// iOS rounds the corners itself and wants an opaque square: a calmer 72 %.
await out("public/icons/apple-touch-icon.png", await icon("dark", 180, 0.72));
await out("public/icons/icon-192.png", await icon("dark", 192, 0.76));
await out("public/icons/icon-512.png", await icon("dark", 512, 0.76));
// Maskable: launchers crop to a circle of 80 % of the width. The mark's
// half-diagonal at this height stays inside it.
await out("public/icons/icon-maskable-512.png", await icon("dark", 512, 0.62));
