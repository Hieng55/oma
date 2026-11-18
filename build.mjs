import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(projectRoot, "dist");
const outputDir = path.join(projectRoot, "out");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(sourceDir, outputDir, { recursive: true });

console.log(`Built static site: ${sourceDir} -> ${outputDir}`);
