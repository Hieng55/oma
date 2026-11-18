import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(projectRoot, 'dist');
const assetsDir = path.join(distDir, 'assets');

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  }));
  return nested.flat();
};

// Remove thumbnails from older optimization attempts. WebP originals are small
// enough to serve directly with native lazy loading.
await rm(path.join(assetsDir, 'thumbs'), { recursive: true, force: true });

const assetFiles = await walk(assetsDir);
const rasterFiles = assetFiles.filter((file) => /\.(?:jpe?g|png)$/i.test(file));
const replacements = new Map();
let originalBytes = 0;
let optimizedBytes = 0;

for (const sourcePath of rasterFiles) {
  const sourceStats = await stat(sourcePath);
  const outputPath = sourcePath.replace(/\.(?:jpe?g|png)$/i, '.webp');
  const image = sharp(sourcePath).rotate().resize({
    width: 1600,
    height: 1600,
    fit: 'inside',
    withoutEnlargement: true
  });

  await image.webp({ quality: 72, alphaQuality: 90, effort: 6, smartSubsample: true }).toFile(outputPath);
  const outputStats = await stat(outputPath);
  const oldReference = path.relative(distDir, sourcePath).replaceAll('\\', '/');
  const newReference = path.relative(distDir, outputPath).replaceAll('\\', '/');

  replacements.set(oldReference, newReference);
  replacements.set(path.basename(sourcePath), path.basename(outputPath));
  originalBytes += sourceStats.size;
  optimizedBytes += outputStats.size;
  await rm(sourcePath);
}

const sourceFiles = (await walk(distDir)).filter((file) => /\.(?:html|css|js)$/i.test(file));
for (const sourceFile of sourceFiles) {
  let contents = await readFile(sourceFile, 'utf8');
  let changed = false;
  for (const [oldReference, newReference] of replacements) {
    if (!contents.includes(oldReference)) continue;
    contents = contents.replaceAll(oldReference, newReference);
    changed = true;
  }
  if (changed) await writeFile(sourceFile, contents);
}

const reduction = originalBytes > 0 ? Math.round((1 - optimizedBytes / originalBytes) * 100) : 0;
console.log(`Optimized ${rasterFiles.length} images: ${(originalBytes / 1048576).toFixed(2)} MB -> ${(optimizedBytes / 1048576).toFixed(2)} MB (${reduction}% smaller)`);
