/**
 * Browser-based QA for the Aarti Pandey landing page.
 * Uses playwright-core with the locally installed Microsoft Edge (no browser download).
 * Run with `npm run qa` after `npm install`.
 */
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { collectErrors, launchBrowser, root, writeReport } from './helpers.mjs';

const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;
const viteBin = join(root, 'node_modules', 'vite', 'bin', 'vite.js');

const cases = {
  QA01: { id: 'QA01', area: 'Header', viewport: '375px', action: 'Use navigation', expected: 'Menu reachable and anchors functional', actual: '', status: '', evidence: '' },
  QA02: { id: 'QA02', area: 'Header', viewport: '1024px', action: 'Use navigation', expected: 'Horizontal navigation functional', actual: '', status: '', evidence: '' },
  QA03: { id: 'QA03', area: 'Hero', viewport: '375px', action: 'Resize window', expected: 'Content stacks without cropping', actual: '', status: '', evidence: '' },
  QA04: { id: 'QA04', area: 'Hero', viewport: '768px', action: 'Check image and text', expected: 'No overlap or horizontal scrolling', actual: '', status: '', evidence: '' },
  QA05: { id: 'QA05', area: 'Features', viewport: '375px', action: 'Inspect cards', expected: 'Three cards stacked and readable', actual: '', status: '', evidence: '' },
  QA06: { id: 'QA06', area: 'Features', viewport: '1024px', action: 'Inspect cards', expected: 'Three aligned cards', actual: '', status: '', evidence: '' },
  QA07: { id: 'QA07', area: 'Form', viewport: '375px', action: 'Submit empty fields', expected: 'Accessible field-level errors', actual: '', status: '', evidence: '' },
  QA08: { id: 'QA08', area: 'Form', viewport: '768px', action: 'Submit invalid email', expected: 'Error visible and focus usable', actual: '', status: '', evidence: '' },
  QA09: { id: 'QA09', area: 'Form', viewport: '1024px', action: 'Submit valid data', expected: 'Confirmation without page reload', actual: '', status: '', evidence: '' },
  QA10: { id: 'QA10', area: 'Keyboard', viewport: '375px', action: 'Navigate using Tab', expected: 'All controls reachable', actual: '', status: '', evidence: '' },
  QA11: { id: 'QA11', area: 'Semantics', viewport: '1024px', action: 'Inspect landmarks', expected: 'Semantic header main sections footer', actual: '', status: '', evidence: '' },
  QA12: { id: 'QA12', area: 'Performance', viewport: '1024px', action: 'Run production build', expected: 'No build errors or missing assets', actual: '', status: '', evidence: '' },
  QA13: { id: 'QA13', area: 'Responsiveness', viewport: '390px', action: 'Resize gradually', expected: 'No horizontal scrolling at intermediate sizes', actual: '', status: '', evidence: '' },
  QA14: { id: 'QA14', area: 'Images', viewport: '768px', action: 'Inspect image attributes', expected: 'Meaningful alt and no layout shift', actual: '', status: '', evidence: '' },
};

function setCase(id, passed, actual, evidence = '') {
  cases[id].actual = actual;
  cases[id].status = passed ? 'PASS' : 'FAIL';
  cases[id].evidence = evidence;
}

function csv(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error('Vite preview server did not become ready.');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// QA12: build first so the preview always serves the production output.
let buildOutput = '';
try {
  buildOutput = execFileSync(process.execPath, [viteBin, 'build'], { cwd: root, encoding: 'utf8' });
} catch (error) {
  buildOutput = `BUILD FAILED: ${error.stderr || error.message}`;
}
const distAssets = ['index.html', 'favicon.svg', 'assets/AartiPandey_Hero_Illustration.svg', 'assets/Icon_Strategy.svg'];
const missingAssets = distAssets.filter((asset) => !existsSync(join(root, 'dist', asset)));
const buildPassed = buildOutput.includes('built in') && missingAssets.length === 0;
setCase(
  'QA12',
  buildPassed,
  buildPassed
    ? `Vite build succeeded (${buildOutput.match(/built in ([\d.]+m?s)/)?.[1] ?? 'timed'}); emitted JS/CSS, favicon and all brand assets.`
    : `Build failed or assets missing: ${missingAssets.join(', ')} ${buildOutput.slice(-300)}`,
  'qa/evidence/results.json (build.output)',
);

const server = spawn(process.execPath, [viteBin, 'preview', '--host', '127.0.0.1', '--port', String(port)], {
  cwd: root,
  stdio: 'ignore',
});

let browser;
let executablePath;
try {
  await waitForServer(baseUrl);
  ({ browser, executablePath } = await launchBrowser());
  const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
  const consoleErrors = collectErrors(page);

  async function audit(width) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'load' });
    await sleep(120);
    return page.evaluate(() => {
      const vw = window.innerWidth;
      const box = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height), right: Math.round(rect.right), bottom: Math.round(rect.bottom) };
      };
      const offenders = [...document.querySelectorAll('body *')]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && (rect.right > vw + 1 || rect.left < -1);
        })
        .slice(0, 8)
        .map((element) => `${element.tagName.toLowerCase()}[${element.id || element.getAttribute('aria-label') || ''}] right=${Math.round(element.getBoundingClientRect().right)}`);
      return {
        vw,
        docScrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        offenders,
        heroContent: box('#hero > div > div:first-of-type'),
        heroVisual: box('#hero > div > div:last-of-type'),
        cards: [...document.querySelectorAll('#services li')].map((element) => {
          const rect = element.getBoundingClientRect();
          return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width) };
        }),
        fields: [...document.querySelectorAll('#register form input, #register form select')].map((element) => {
          const rect = element.getBoundingClientRect();
          return { name: element.name, x: Math.round(rect.x), y: Math.round(rect.y) };
        }),
        images: [...document.images].map((image) => ({
          src: image.getAttribute('src'),
          alt: image.getAttribute('alt'),
          width: image.getAttribute('width'),
          height: image.getAttribute('height'),
          naturalWidth: image.naturalWidth,
        })),
        menuVisible: getComputedStyle(document.querySelector('button[aria-controls="primary-navigation"]')).display !== 'none',
        navVisible: getComputedStyle(document.querySelector('#primary-navigation')).display !== 'none',
        landmarks: {
          header: document.querySelectorAll('#root > div > header').length,
          main: document.querySelectorAll('main').length,
          sections: document.querySelectorAll('main section').length,
          footer: document.querySelectorAll('footer').length,
        },
      };
    });
  }

  const metrics = {};
  const screenshot = async (width, suffix = '') => {
    const file = `qa/evidence/${width}px${suffix ? `-${suffix}` : ''}.png`;
    await page.screenshot({ path: join(root, file), fullPage: true });
    return file;
  };

  // 375px: mobile menu, hero stacking, service cards, empty-form errors.
  let m = await audit(375);
  metrics[375] = m;
  await screenshot(375);
  const menuOpened = await page.locator('button[aria-controls="primary-navigation"]').click().then(() => true).catch(() => false);
  await sleep(100);
  const mobileNav = await page.locator('#primary-navigation a').count();
  await page.locator('#primary-navigation a[href="#services"]').click();
  await sleep(250);
  const mobileHash = await page.evaluate(() => window.location.hash);
  const menuEvidence = await screenshot(375, 'menu-open');
  setCase('QA01', menuOpened && mobileNav === 4 && mobileHash === '#services', `Menu button opened disclosure; ${mobileNav} links present; Services anchor set hash to ${mobileHash}.`, menuEvidence);

  const stacked375 = m.heroVisual.y >= m.heroContent.bottom - 4 && m.heroVisual.right <= 375 + 1;
  setCase('QA03', stacked375, `Hero illustration starts at y=${m.heroVisual.y}, content ends at y=${m.heroContent.bottom}; image right edge ${m.heroVisual.right}px. No cropping.`, 'qa/evidence/375px.png');

  const cardXs375 = [...new Set(m.cards.map((card) => card.x))];
  setCase('QA05', m.cards.length === 3 && cardXs375.length === 1, `${m.cards.length} service cards, all at x=${cardXs375.join(',')} (single column).`, 'qa/evidence/375px.png');

  await page.locator('#register form button[type="submit"]').click();
  const emptyErrors = await page.locator('[class*="error"]').allTextContents();
  const emptyInvalid = await page.locator('#fullName').getAttribute('aria-invalid');
  const focusAfterEmpty = await page.evaluate(() => document.activeElement?.id);
  await screenshot(375, 'form-errors');
  setCase(
    'QA07',
    emptyErrors.length === 3 && emptyInvalid === 'true' && focusAfterEmpty === 'fullName',
    `${emptyErrors.length} visible field errors ("${emptyErrors.join(' / ')}"); aria-invalid=${emptyInvalid}; focus moved to #${focusAfterEmpty}.`,
    'qa/evidence/375px-form-errors.png',
  );

  // 390px and intermediate resize checks (QA13).
  const resizeWidths = [375, 390, 600, 768, 900, 1024, 1280, 1440, 768, 390];
  const resizeReport = [];
  for (const width of resizeWidths) {
    await page.setViewportSize({ width, height: 900 });
    await sleep(60);
    const measured = await page.evaluate(() => ({ vw: window.innerWidth, sw: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    resizeReport.push(`${width}: scrollWidth=${measured.sw}/vw=${measured.vw}`);
  }
  const resizePassed = resizeReport.every((line) => {
    const [sw, vw] = line.match(/scrollWidth=(\d+)\/vw=(\d+)/).slice(1).map(Number);
    return sw <= vw + 1;
  });
  setCase('QA13', resizePassed, `No horizontal overflow at ${resizeReport.join('; ')}.`, 'qa/evidence/results.json (resizeReport)');

  // 768px: tablet layout, invalid email, image attributes.
  m = await audit(768);
  metrics[768] = m;
  await screenshot(768);
  const noOverflow768 = m.docScrollWidth <= 768 + 1 && m.offenders.length === 0;
  const stacked768 = m.heroVisual.y >= m.heroContent.bottom - 4;
  setCase('QA04', noOverflow768 && stacked768, `Hero visual below text (y=${m.heroVisual.y} vs content bottom ${m.heroContent.bottom}); document scrollWidth=${m.docScrollWidth}; overflow offenders=${m.offenders.length}.`, 'qa/evidence/768px.png');

  const imagesOk = m.images.length === 5 && m.images.every((image) => image.alt && image.alt.length > 20 && image.width && image.height && image.naturalWidth > 0);
  setCase('QA14', imagesOk, `${m.images.length} decorative/brand images checked: all have descriptive alt, intrinsic width/height, and loaded successfully.`, 'qa/evidence/results.json (images.768)');

  await page.fill('#fullName', 'Taylor Rivera');
  await page.fill('#email', 'not-an-email');
  await page.fill('#organization', 'Example Co');
  await page.locator('#register form button[type="submit"]').click();
  const emailError = await page.locator('#email-error').textContent().catch(() => '');
  const focusAfterEmail = await page.evaluate(() => document.activeElement?.id);
  await screenshot(768, 'email-error');
  setCase('QA08', Boolean(emailError) && focusAfterEmail === 'email', `Invalid email produced visible error "${emailError}"; focus stayed on #${focusAfterEmail}.`, 'qa/evidence/768px-email-error.png');

  // 1024px: horizontal nav, aligned cards, semantics, valid submission.
  m = await audit(1024);
  metrics[1024] = m;
  await screenshot(1024);
  setCase('QA02', m.navVisible && !m.menuVisible, `Horizontal navigation visible (${m.navVisible}); hamburger hidden (${!m.menuVisible}).`, 'qa/evidence/1024px.png');
  await page.locator('#primary-navigation a[href="#approach"]').click();
  await sleep(250);
  const desktopHash = await page.evaluate(() => window.location.hash);
  if (desktopHash !== '#approach') setCase('QA02', false, `Anchor hash was ${desktopHash} instead of #approach.`, 'qa/evidence/1024px.png');

  const cardXs1024 = [...new Set(m.cards.map((card) => card.x))];
  const cardYs1024 = [...new Set(m.cards.map((card) => card.y))];
  setCase('QA06', m.cards.length === 3 && cardXs1024.length === 3 && m.cards[0].w === m.cards[1].w, `${m.cards.length} cards in ${cardXs1024.length} columns at x=${cardXs1024.join(',')}, aligned at y=${cardYs1024.join(',')}, equal width ${m.cards[0].w}px.`, 'qa/evidence/1024px.png');

  const landmarks = m.landmarks;
  const semanticsOk = landmarks.header === 1 && landmarks.main === 1 && landmarks.sections >= 5 && landmarks.footer === 1;
  setCase('QA11', semanticsOk, `header=${landmarks.header}, main=${landmarks.main}, main sections=${landmarks.sections}, footer=${landmarks.footer}.`, 'qa/evidence/results.json (landmarks.1024)');

  await page.evaluate(() => { window.__qaSentinel = 'alive'; });
  await page.fill('#fullName', 'Taylor Rivera');
  await page.fill('#email', 'taylor@example.com');
  await page.fill('#organization', 'Example Co');
  await page.selectOption('#interest', 'Operations');
  await page.locator('#register form button[type="submit"]').click();
  const successText = await page.locator('#register [role="status"] p').textContent().catch(() => '');
  const sentinel = await page.evaluate(() => window.__qaSentinel);
  const successEvidence = await screenshot(1024, 'form-success');
  setCase(
    'QA09',
    successText?.includes('Thank you. Your request has been recorded in this browser session.') && sentinel === 'alive',
    `Success message: "${successText}"; page sentinel=${sentinel} (no reload); no network submission configured.`,
    successEvidence,
  );

  // 375px: keyboard traversal (QA10).
  await audit(375);
  await page.keyboard.press('Tab');
  const focusSequence = [];
  for (let i = 0; i < 30; i += 1) {
    const descriptor = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element || element === document.body) return 'body';
      return element.id || element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 28) || element.tagName.toLowerCase();
    });
    focusSequence.push(descriptor);
    await page.keyboard.press('Tab');
  }
  const requiredFocus = ['fullName', 'email', 'organization', 'interest', 'Request a place', 'Briefing', 'Contact'];
  const reachable = requiredFocus.every((item) => focusSequence.some((entry) => entry.includes(item)));
  setCase('QA10', reachable && focusSequence[0] === 'Skip to main content', `Tab order from top: ${focusSequence.slice(0, 14).join(' → ')} … (${focusSequence.length} stops). All form and footer controls reachable.`, 'qa/evidence/results.json (focusSequence)');

  // 1440px reference width screenshot.
  m = await audit(1440);
  metrics[1440] = m;
  await screenshot(1440);

  writeReport('results.json', { browser: await browser.version(), executablePath, baseUrl, buildOutput, metrics, resizeReport, focusSequence, consoleErrors, cases });
  writeFileSync(
    join(root, 'COMPLETED_QA_MATRIX.csv'),
    ['Test_ID,Area,Viewport,Action,Expected_Result,Actual_Result,Status,Evidence', ...Object.values(cases).map((item) => [item.id, item.area, item.viewport, item.action, item.expected, item.actual, item.status, item.evidence].map(csv).join(','))].join('\r\n') + '\r\n',
  );

  const failed = Object.values(cases).filter((item) => item.status !== 'PASS');
  console.log(`QA complete: ${Object.keys(cases).length - failed.length}/${Object.keys(cases).length} passed.`);
  if (consoleErrors.length) console.log(`Console errors: ${consoleErrors.join(' | ')}`);
  if (failed.length) {
    console.log('Failed cases: ' + failed.map((item) => item.id).join(', '));
    process.exitCode = 1;
  }
} finally {
  await browser?.close();
  server.kill();
}
