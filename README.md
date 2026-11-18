# Saif-Eddine Bahiri — Portfolio

Bilingual (French / English) portfolio and print-ready CV of a Bachelor's student in Cybersecurity & Cloud Computing, built as a fast, fully static site with no backend.

> **Live site:** https://portofolio-five-weld-92.vercel.app

## What it presents

- **Profile and studies**: Bachelor's in Cybersecurity & Cloud Computing (ESTK, Cadi Ayyad University), after a DUT in Computer Science.
- **Internship experience**: cybersecurity and penetration testing, full-stack development, IT operations in banking.
- **Projects**: ASTA (an autonomous security testing agent, used only within an authorized scope) and Student Hub (a multi-role Django and React platform).
- **Skills**: security tooling, languages, frameworks, databases, networks and methods.
- **CV**: downloadable PDF in French and in English, generated from the same content.

## Tech stack

| Area | Technology |
|---|---|
| Build tool | Vite |
| Language | TypeScript (vanilla, no framework) |
| Styling | Modular CSS with design tokens, print stylesheet for the CV |
| Animation | GSAP, ScrollTrigger, Lenis (smooth scrolling) |
| CV generation | Playwright (headless Chromium) renders selectable-text PDFs |
| Quality | ESLint, strict TypeScript, layout QA script |
| Deployment | Vercel and GitHub Pages (GitHub Actions workflow) |

## Features

- French and English versions driven by two JSON files (`src/content/fr.json`, `src/content/en.json`); `?lang=en` forces English.
- Light and dark theme, with theme and language remembered in local storage.
- Print-ready CV page and two committed PDFs, so deployments do not need a browser.
- Search and social assets: sitemap, robots file, web manifest, Open Graph preview and touch icon.
- No backend: contact actions use email, phone and clipboard APIs only.
- Self-hosted fonts with their open font licences.

## Skills demonstrated

- Front-end engineering without a framework: TypeScript, modular CSS, motion design.
- Internationalization with a single source of truth for content.
- Build automation: PDF generation, linting, type checking and CI deployment.
- Attention to performance, accessibility and responsive layout.
- Responsible presentation of security work: no exploit instructions or payloads published.

## Run locally

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Build

Install the Playwright Chromium browser once (or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an installed Chrome or Chromium):

```sh
npx playwright install chromium
npm run build
npm run lint
```

`npm run build` produces the static site in `dist/`. `npm run build:full` also regenerates both CV PDFs and the PNG assets.

## Deploy

- **Vercel**: import the repository with the Vite preset, build command `npm run build`, output directory `dist`.
- **GitHub Pages**: the workflow in `.github/workflows/pages.yml` builds and publishes `dist` from `main`. Enable GitHub Pages with GitHub Actions as the source.

## Author

**Saif-Eddine Bahiri** — [GitHub](https://github.com/saif-sudo-afk)

