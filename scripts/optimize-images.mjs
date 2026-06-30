// One-off image optimizer. Recompresses the oversized work/ and services/
// JPGs in place: resize to a sane max width, progressive JPEG. Originals are
// backed up to .scratch/img-originals/ first so the operation is reversible.
import sharp from "sharp";
import { readdir, mkdir, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const BACKUP = path.join(ROOT, "..", ".scratch", "img-originals");
const DIRS = ["work", "services"];
const MAX_W = 2400;
const QUALITY = 78;

function mb(bytes) {
  return (bytes / 1048576).toFixed(2) + " MB";
}

async function run() {
  let beforeTotal = 0;
  let afterTotal = 0;

  for (const dir of DIRS) {
    const abs = path.join(PUBLIC, dir);
    if (!existsSync(abs)) continue;
    const backupDir = path.join(BACKUP, dir);
    await mkdir(backupDir, { recursive: true });

    const files = (await readdir(abs)).filter((f) => /\.jpe?g$/i.test(f));
    for (const file of files) {
      const src = path.join(abs, file);
      const before = (await stat(src)).size;
      beforeTotal += before;

      // Back up the original once.
      const backup = path.join(backupDir, file);
      if (!existsSync(backup)) await copyFile(src, backup);

      // Recompress from the backup (the untouched original) into a buffer,
      // then write over the live file.
      const buf = await sharp(backup)
        .resize({ width: MAX_W, withoutEnlargement: true })
        .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
        .toBuffer();

      await sharp(buf).toFile(src);
      const after = (await stat(src)).size;
      afterTotal += after;

      console.log(`${dir}/${file}: ${mb(before)} -> ${mb(after)}`);
    }
  }

  console.log("-----");
  console.log(`TOTAL: ${mb(beforeTotal)} -> ${mb(afterTotal)}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
