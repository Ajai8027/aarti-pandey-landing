/** Shared setup for the browser-based QA scripts. */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

export const root = fileURLToPath(new URL('..', import.meta.url));
export const evidenceDir = join(root, 'qa', 'evidence');
mkdirSync(evidenceDir, { recursive: true });

const edgeCandidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/microsoft-edge',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
];

/** Launch headless Edge using the locally installed browser (no download). */
export async function launchBrowser() {
  const executablePath = edgeCandidates.find(existsSync);
  if (!executablePath) {
    throw new Error('Microsoft Edge executable was not found; update edgeCandidates in qa/helpers.mjs.');
  }
  const browser = await chromium.launch({ executablePath, headless: true });
  return { browser, executablePath };
}

/** Collect console errors and uncaught page errors for a page. */
export function collectErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

/** Write a JSON report into qa/evidence. */
export function writeReport(filename, report) {
  writeFileSync(join(evidenceDir, filename), JSON.stringify(report, null, 2));
}
