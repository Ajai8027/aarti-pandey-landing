/**
 * Verifies the self-contained standalone/index.html when opened directly from
 * disk (file://), with no dev server, network connection, or asset files.
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import { collectErrors, launchBrowser, writeReport } from './helpers.mjs';

const htmlPath = fileURLToPath(new URL('../standalone/index.html', import.meta.url));
const url = pathToFileURL(htmlPath).href;

const { browser } = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
const errors = collectErrors(page);

await page.goto(url, { waitUntil: 'load' });
await page.locator('h1').waitFor();

const rendering = await page.evaluate(() => ({
  heading: document.querySelector('h1')?.textContent?.trim(),
  sections: document.querySelectorAll('main section').length,
  fields: document.querySelectorAll('#register form input, #register form select').length,
  imagesLoaded: [...document.images].every((image) => image.naturalWidth > 0),
  overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
}));

await page.locator('#register form button[type="submit"]').click();
const emptyErrors = await page.locator('#register [class*="error"]').allTextContents();

await page.fill('#fullName', 'Standalone Reviewer');
await page.fill('#email', 'invalid-address');
await page.fill('#organization', 'Example Org');
await page.locator('#register form button[type="submit"]').click();
const emailError = await page.locator('#email-error').textContent().catch(() => '');

await page.fill('#email', 'reviewer@example.com');
await page.selectOption('#interest', 'Strategy');
await page.evaluate(() => {
  window.__sentinel = 'alive';
});
await page.locator('#register form button[type="submit"]').click();
const success = await page.locator('#register [role="status"] p').textContent().catch(() => '');
const sentinel = await page.evaluate(() => window.__sentinel);

await page.locator('#primary-navigation a[href="#services"]').evaluate((element) => element.click());
await page.waitForTimeout(150);
const hash = await page.evaluate(() => window.location.hash);

const passed =
  rendering.heading === 'Build clarity.Move forward.' &&
  rendering.sections === 5 &&
  rendering.fields === 4 &&
  rendering.imagesLoaded &&
  !rendering.overflow &&
  emptyErrors.length === 3 &&
  emailError.includes('valid email') &&
  success.includes('Thank you. Your request has been recorded in this browser session.') &&
  sentinel === 'alive' &&
  hash === '#services' &&
  errors.length === 0;

const report = {
  url,
  status: passed ? 'PASS' : 'FAIL',
  ...rendering,
  emptyErrors,
  emailError,
  success,
  sentinel,
  hash,
  errors,
};
writeReport('standalone.json', report);

console.log(`Standalone file:// page: ${report.status}`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!passed) process.exitCode = 1;
