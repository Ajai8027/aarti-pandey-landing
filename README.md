# Aarti Pandey Business Studio — Responsive Landing Page

A fast, single-page React landing page for Aarti Pandey Business Studio, built from the supplied desktop (1440px), tablet (768px) and mobile (375px) references. It includes an accessible briefing registration form that validates and confirms entirely in the browser—no backend, analytics, or external submission.

## Requirements

- Node.js 20.19+ or 22.12+ (Vite 8 requirement; verified on Node 24)
- npm

## Commands

```bash
npm install       # install dependencies
npm run dev       # start the Vite dev server (http://localhost:5173)
npm run build     # produce the optimized production build in dist/
npm run preview   # serve the production build locally (http://localhost:4173)
npm run qa        # build, launch Microsoft Edge headless, run 14 viewport/QA checks
```

`npm run qa` uses `playwright-core` with the locally installed Microsoft Edge; it does not download a browser. It writes screenshots and measurements to `qa/evidence/` and overwrites `COMPLETED_QA_MATRIX.csv` with the recorded results.

## Project structure

```
aarti-pandey-landing/
├── index.html                     # document metadata, viewport, favicon
├── public/
│   ├── assets/                    # original supplied logo, hero and icon artwork
│   └── favicon.svg
├── src/
│   ├── main.jsx                   # React root + global style imports
│   ├── App.jsx                    # landmarks, skip link and section order
│   ├── components/
│   │   ├── Header.jsx             # logo, desktop nav, mobile disclosure menu
│   │   ├── Hero.jsx               # headline, CTAs, hero illustration
│   │   ├── Features.jsx           # "Services" section and three service cards
│   │   ├── Approach.jsx           # three numbered approach steps
│   │   ├── About.jsx              # short about band
│   │   ├── RegistrationForm.jsx   # controlled form, validation, success state
│   │   └── Footer.jsx             # links, example contact, legal copy
│   └── styles/
│       ├── tokens.css             # brand colours, spacing, radii custom properties
│       ├── global.css             # reset, typography, focus and reduced motion
│       └── *.module.css           # one scoped stylesheet per component
├── qa/
│   ├── responsive-check.mjs       # automated browser QA driver
│   └── evidence/                  # screenshots + results.json
├── COMPLETED_QA_MATRIX.csv         # 14 test cases with actual results
├── TECHNICAL_SUMMARY.pdf           # component/design/test summary
├── COMPLETION_NOTE.txt             # final deliverable and URL checklist
└── PUBLISHING.md                   # private repo, deployment and Drive steps
```

## Component responsibilities

| Component | Responsibility |
| --- | --- |
| `Header` | Brand artwork, primary navigation (`#services`, `#approach`, `#about`, `#register`), accessible mobile menu with `aria-expanded`/`aria-controls`, Escape-to-close and auto-close on resize. |
| `Hero` | Eyebrow, H1, supporting copy, primary/secondary CTAs and the supplied growth-overview illustration with intrinsic dimensions and informative alt text. |
| `Features` | `#services` section; three cards with the supplied icons, numbering, titles and copy. Named `Features` to match the technical specification. |
| `Approach` | `#approach` section; ordered Understand → Prioritize → Implement steps. |
| `About` | `#about` section; the supplied "Work designed for practical teams" copy. |
| `RegistrationForm` | `#register` section; controlled fields, client-side validation, keyboard focus management and `aria-live` success state. No props. |
| `Footer` | Brand, tagline, in-page links, example `mailto:` link and legal line. |

All components are functional components. `Header` uses `useState`/`useEffect`; `RegistrationForm` uses `useState`, `useRef` and `useEffect`.

## Styling and breakpoints

- CSS Modules scope every component's styles; `tokens.css` and `global.css` hold shared design tokens and resets.
- Brand palette: navy `#112B40`, teal `#0F847C`, accent `#E8B46A`, off-white `#F5F8F9`, slate `#55707B`.
- Fluid base layout with explicit media queries at **768px** (tablet) and **1024px** (desktop). Verified at 375, 390, 600, 768, 900, 1024, 1280 and 1440px.
- Content container: `max-width: 1270px`; inline padding 86px desktop, 42px tablet, 23px mobile.
- Hero: two columns at ≥1024px, stacked below 1024px. Services: three columns at ≥768px, stacked at 375px. Registration fields: two columns at ≥1024px, single column below.

## Registration form behaviour

- Required: Full name, Work email, Organization. Optional: Area of interest (Strategy, Operations, Team Enablement).
- Native validation is disabled (`noValidate`) so custom messages can be announced consistently. Validation runs on submit and on blur; a corrected field clears its error immediately.
- Errors are rendered next to the field, linked with `aria-describedby`, flagged with `aria-invalid="true"`, and the first invalid field receives keyboard focus.
- A valid submission replaces the form with an `aria-live="polite"` confirmation: "Thank you. Your request has been recorded in this browser session." A "Send another request" button resets the form.
- Nothing is sent, stored in `localStorage`, or logged. The data exists only in React component state for the current browser session.

## Accessibility

- Semantic `header`, `main`, `section`, `nav`, `footer`, labelled form controls, logical heading levels and ordered lists for the approach steps.
- Skip link, visible `:focus-visible` indicators, descriptive image `alt` text, `prefers-reduced-motion` support, and `scroll-margin-top` for anchors.
- Mobile menu is a real disclosure button (not hover-only) and closes on link click, Escape, or return to the desktop breakpoint.

## Deployment

See `PUBLISHING.md` for the private GitHub repository, Vercel/Netlify preview and Google Drive reviewer-share steps. Build output directory is `dist/`.

## Known limitations

- The footer Contact link uses the guide's example address `hello@example.org`; replace it with an approved public address before production use.
- Form data is deliberately not persisted or delivered anywhere; "recorded" means held in the current browser session only.
- Automated browser QA was executed on Microsoft Edge (Chromium) 157. Other browser engines were not available in the build environment.
