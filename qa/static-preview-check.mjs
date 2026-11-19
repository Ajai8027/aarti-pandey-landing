/**
 * Verifies that the built site renders when dist/index.html is opened by a
 * plain static server (for example VS Code Live Preview on port 3000).
 * Run `npm run build` and serve the workspace root before running this file.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const url = 'http://127.0.0.1:3000/aarti-pandey-landing/dist/index.html?vscode-livepreview=true';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const browser = await chromium.launch({ executablePath: edgePath, headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(url, { waitUntil: 'load' });
await page.locator('h1').waitFor();

const result = await page.evaluate(() => ({
  title: document.title,
  heading: document.querySelector('h1')?.textContent?.trim(),
  sections: document.querySelectorAll('main section').length,
  fields: document.querySelectorAll('#register form input, #register form select').length,
  images: [...document.images].map((image) => ({ src: image.getAttribute('src'), loaded: image.naturalWidth > 0 })),
}));

const passed =
  result.heading === 'Build clarity.Move forward.' &&
  result.sections === 5 &&
  result.fields === 4 &&
  result.images.length === 5 &&
  result.images.every((image) => image.loaded) &&
  errors.length === 0;

const report = { url, status: passed ? 'PASS' : 'FAIL', ...result, errors };
writeFileSync(fileURLToPath(new URL('./evidence/static-preview.json', import.meta.url)), JSON.stringify(report, null, 2));

console.log(`Static Live Preview: ${report.status}`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
