# Saif-Eddine Bahiri — Portfolio

A bilingual, fully static portfolio and print-ready CV built with Vite, vanilla TypeScript, CSS, GSAP, ScrollTrigger and Lenis. French and English CV pages and PDFs share the content in `src/content/fr.json` and `src/content/en.json`.

## Run locally

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Use `?lang=en` for English or the language control to switch. Theme choice and language are remembered in local storage.

## Build

Install the Playwright Chromium browser once (or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an installed Chrome or Chromium executable):

```sh
npx playwright install chromium
npm run build
npm run lint
```

`npm run build` produces the static website in `dist/` and includes the committed CV PDFs, social preview and touch icon. `npm run build:full` also renders both selectable-text CV PDFs and regenerates the PNG assets; `npm run build:cv` regenerates the PDFs on a machine with Chromium installed. PDFs are committed under `public/assets/` so deployments do not need to install a browser.

## Deploy

### Vercel

Import this repository in Vercel with the Vite preset, build command `npm run build`, and output directory `dist`. Both CV PDFs are committed under `public/assets/`, so deployment does not depend on a headless browser.

### GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and publishes `dist` from `main`. Enable GitHub Pages with GitHub Actions as the deployment source.

## Content and safety

All CV facts live in the two locale JSON files. ASTA is described only as an authorized-scope, operator-approved testing tool. The site includes no exploit instructions or payloads. It has no backend; contact actions use email, phone, and clipboard APIs.
