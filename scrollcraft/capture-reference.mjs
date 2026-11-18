import { chromium } from 'playwright-core';
import fs from 'node:fs';

const out = 'D:/oma/site/scrollcraft/reference';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.goto('https://gangatattoolosangeles.com/', { waitUntil: 'networkidle', timeout: 90000 });
const consent = page.getByRole('button', { name: /accept/i });
if (await consent.count()) await consent.first().click().catch(() => {});
await page.waitForTimeout(1800);
const height = await page.evaluate(() => document.documentElement.scrollHeight);
const stops = [0, .08, .17, .29, .42, .56, .70, .84, .96];
for (let i = 0; i < stops.length; i += 1) {
  await page.evaluate((y) => scrollTo(0, y), Math.round((height - 1000) * stops[i]));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${out}/frame-${String(i).padStart(2, '0')}.png` });
}
console.log(JSON.stringify({ height, frames: stops.length }));
await browser.close();
