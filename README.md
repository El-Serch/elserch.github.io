# elserch.github.io

Personal portfolio and online CV for Sergio "El Serch" Inurreta — Product & Service Designer.

**Live at [elserch.com](https://www.elserch.com)**

Static HTML and CSS, served by GitHub Pages. No build step, no framework, no package manager — open a file and edit it.

## Structure

```
index.html                    Homepage: hero, selected work, what I do, services, about, experience, contact
scotiabank-case-study.html    Flagship case study: ScotiaConnect, six markets (2022–present)
nyhealth-case-study.html      Project note: Health Pass + virtual assistant (2021)
walmart-case-study.html       Project note: LATAM HR change management (2019)
services.html                 Three engagement tiers; scope public, price row unlocks in place
pricing.html                  Redirect to services.html, so old links keep working
confidential-a.html           Password-protected: project under NDA   (generated, do not edit)
confidential-b.html           Password-protected: project under NDA   (generated, do not edit)
assets/site.css               All styles, shared by every page
assets/site.js                Theme, language, nav highlighting, pricing cards, in-place unlock
assets/fonts/                 Schibsted Grotesk (variable, self-hosted) and its OFL licence
assets/elserch-logo.svg       Logo mark — also the favicon
CNAME                         Custom domain for GitHub Pages
```

Every page links the same `assets/site.css` and `assets/site.js`. A short inline script in each page's `<head>` sets the theme (and, on bilingual pages, the language) before first paint so neither flashes.

## Running locally

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

Opening `index.html` straight from disk mostly works too, but the self-hosted font and the unlock (Web Crypto) behave best over http.

## Editing

**Content rules.** Everything on the site is real: no placeholder copy, no invented metrics. Where an artifact can't be shown, use the NDA-protected artifact card (`<figure class="artifact">`, see any case study) rather than an empty image slot. Numbers should say what they count ("17 platforms benchmarked for file and payment workflows"), not just a percentage.

**Case studies follow one shape.** Header (kicker, headline, lede, meta row), then numbered `cs-section`s: Context, My role, The system, Key decisions (Problem → Decision → Why → Impact), Outcomes, Reflection. The shorter project notes use a subset. System diagrams are plain HTML (`<ol class="flow">`); set `style="--cols: 3"` for a three-column one.

**The homepage and Services are bilingual; the case studies are English only.** Every piece of bilingual text is written twice, side by side:

```html
<h2><span lang="en">Selected work</span><span lang="es">Trabajo seleccionado</span></h2>
```

One CSS rule hides whichever language isn't active, so **any new text needs both spans** or it will show in both languages. Text that reads the same in both (names, numbers, client names) needs no spans. Attributes can't hold spans, so aria-labels use `data-label-en` / `data-label-es` and the page title uses `data-title-en` / `data-title-es` on `<html>`.

**Locked pages are generated — edit them elsewhere.** `confidential-a.html` and `confidential-b.html` hold only encrypted content. Their readable sources, and the script that locks them, live in a separate private repo. To change one: edit its source there, run the lock script, then commit the regenerated file here.

The prices on `services.html` are locked the same way: the price row is encrypted into the `<!-- lock:prices -->` slot and replaces the "On request" row when the password is entered. The lock script rewrites that slot, so leave it alone; everything else in `services.html` is edited here as normal.

Visitors unlock with a shared password (AES-GCM, key derived with PBKDF2-SHA256). Capitals, spacing and accents don't matter. One unlock opens the prices and both locked pages for the rest of that browser tab. Private images are embedded inside the encrypted content, never stored in this repo.

**Colors are variables** in `assets/site.css`: a light palette on `:root` and a dark override. The accent is the logo magenta. Change the variables rather than hunting hex codes.

## Notes

- **Language** follows the browser (Spanish browsers see Spanish, everything else English), with an EN/ES toggle in the nav that overrides it and remembers the choice. `elserch.com/?lang=es` opens straight in Spanish, handy for sharing with clients. Like the theme, it's applied in `<head>` before first paint.
- **Dark mode** follows the OS setting, with a toggle in the nav that overrides it and remembers the choice. A script in `<head>` applies the theme before first paint to avoid a flash.
- **Navigation** (Work / Services / About / Experience / Contact) is a vertical rail on the right at desktop widths, swapping its words for icons on windows under 760px tall, and a bottom bar with Material icons below 768px wide. Icon-only links keep their labels in the DOM, visually hidden, so they still announce correctly.
- **No external requests.** Icons are inlined SVG and the font is self-hosted. The site works offline once loaded.
- **Hover styles sit behind `@media (hover: hover)`** so tapped elements don't stay stuck in a hover state on touch devices.

## License

Code is free to borrow. Written content, case studies, and the logo are © Sergio Inurreta — please don't reuse those.
