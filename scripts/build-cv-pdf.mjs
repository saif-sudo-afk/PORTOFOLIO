import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicAssets = path.join(root, 'public', 'assets');
const distAssets = path.join(root, 'dist', 'assets');
await mkdir(publicAssets, { recursive: true });
await mkdir(distAssets, { recursive: true });

const server = await createServer({ configFile: path.join(root, 'vite.config.ts'), server: { host: '127.0.0.1', port: 0, strictPort: false }, logLevel: 'error' });
let browser;
try {
  await server.listen();
  const address = server.httpServer.address();
  if (!address || typeof address === 'string') throw new Error('Vite server did not provide a local address.');
  const origin = `http://127.0.0.1:${address.port}`;
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  for (const language of ['fr', 'en']) {
    const page = await browser.newPage({ locale: language === 'fr' ? 'fr-FR' : 'en-US' });
    await page.goto(`${origin}/cv.html?lang=${language}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const file = `Saif_Eddine_Bahiri_CV_${language.toUpperCase()}.pdf`;
    const pdf = await page.pdf({ path: path.join(publicAssets, file), format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
    await copyFile(path.join(publicAssets, file), path.join(distAssets, file));
    const pages = pdf.toString('latin1').match(/\/Type\s*\/Page(?!s)\b/g)?.length ?? 0;
    if (pages < 1 || pages > 2) throw new Error(`${file} rendered to ${pages} pages; expected a clean one or two-page CV.`);
    console.log(`${file}: generated (${pages} page${pages === 1 ? '' : 's'}, ${pdf.length} bytes)`);
    await page.close();
  }
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await og.goto(`${origin}/og.svg`, { waitUntil: 'load' });
  await og.screenshot({ path: path.join(root, 'public', 'og.png') });
  const icon = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
  await icon.setContent(`<style>*{margin:0}</style><img width="180" height="180" src="${origin}/favicon.svg">`);
  await icon.locator('img').evaluate((image) => image.decode());
  await icon.screenshot({ path: path.join(root, 'public', 'apple-touch-icon.png'), omitBackground: true });
  await copyFile(path.join(root, 'public', 'og.png'), path.join(root, 'dist', 'og.png'));
  await copyFile(path.join(root, 'public', 'apple-touch-icon.png'), path.join(root, 'dist', 'apple-touch-icon.png'));
} finally {
  await browser?.close();
  await server.close();
}
