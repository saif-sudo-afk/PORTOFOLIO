import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const output = path.resolve('qa-artifacts');
await mkdir(output, { recursive: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
const results = [];
for (const width of [320, 360, 768, 1280, 1920, 3840]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const result = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth, heroTitleWidth: document.querySelector('.hero h1')?.getBoundingClientRect().width, firstLineWidth: document.querySelector('.name-line')?.getBoundingClientRect().width, firstLineScrollWidth: document.querySelector('.name-line')?.scrollWidth }));
  result.horizontalOverflow = result.documentWidth > width;
  results.push(result);
  if ([360, 1280].includes(width)) {
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(output, `home-${width}.png`) });
    if (width === 1280) {
      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(output, 'projects-1280.png') });
    }
  }
}
await page.goto('http://127.0.0.1:4173/?lang=en', { waitUntil: 'networkidle' });
const english = await page.evaluate(() => ({ lang: document.documentElement.lang, title: document.title, copy: document.querySelector('.display-copy')?.textContent }));
await page.locator('.theme-toggle').click();
const dark = await page.evaluate(() => document.documentElement.dataset.theme === 'dark');
await page.goto('http://127.0.0.1:4173/cv.html?lang=en', { waitUntil: 'networkidle' });
await page.setViewportSize({ width: 794, height: 1122 });
await page.waitForTimeout(100);
const cv = await page.evaluate(() => ({ lang: document.documentElement.lang, heading: document.querySelector('.cv-header h1')?.textContent, sections: [...document.querySelectorAll('.cv-section h2')].map((node) => node.textContent) }));
await page.emulateMedia({ media: 'print' });
await page.screenshot({ path: path.join(output, 'cv-print-en.png'), fullPage: true });
const pdfs = await Promise.all(['FR', 'EN'].map(async (locale) => {
  const response = await page.request.get(`http://127.0.0.1:4173/assets/Saif_Eddine_Bahiri_CV_${locale}.pdf`);
  return { locale, status: response.status(), contentType: response.headers()['content-type'], bytes: (await response.body()).length };
}));
console.log(JSON.stringify({ viewports: results, english, dark, cv, pdfs, errors }, null, 2));
await browser.close();
