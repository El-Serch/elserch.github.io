# elserch.github.io

Personal portfolio and online CV for Sergio "El Serch" Inurreta — Product & Service Designer.

**Live at [elserch.com](https://www.elserch.com)**

Static HTML and CSS, served by GitHub Pages. No build step, no framework, no package manager — open a file and edit it.

## Structure

```
index.html                    Homepage: hero, about, skills, project grid, experience, pricing (locked in place), contact
scotiabank-case-study.html    Corporate & commercial banking platform (2022–present)
nyhealth-case-study.html      Health Pass + virtual assistant (2021)
walmart-case-study.html       LATAM HR change management (2019)
pricing.html                  Password-protected: scope options and pricing   (generated, do not edit)
confidential-a.html           Password-protected: project under NDA           (generated, do not edit)
confidential-b.html           Password-protected: project under NDA           (generated, do not edit)
assets/elserch-logo.svg       Logo mark — also the favicon
CNAME                         Custom domain for GitHub Pages
```

Each page is self-contained: its styles live in a `<style>` block in the head and its scripts at the end of the body. Nothing is shared between pages, so editing one cannot break another — but a change to shared styling has to be repeated across all six.

## Running locally

Open `index.html` in a browser. That's it.

The one thing that needs a server is testing relative links exactly as GitHub Pages serves them:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Editing

**The case studies are placeholder copy.** Every case study was drafted with plausible but invented detail — team sizes, interview counts, timelines, quotes. Replace before sharing the links widely. The homepage cards and the one-pager content are real.

**Image slots are marked.** Each case study has `<div class="image-placeholder">` blocks with a caption saying what belongs there. Swap the whole div for an `<img>` when you have the asset.

**The homepage is bilingual; the case studies are English only.** Every piece of homepage text is written twice, side by side:

```html
<h2 class="section-title"><span lang="en">Featured Projects</span><span lang="es">Proyectos destacados</span></h2>
```

One CSS rule hides whichever language isn't active, so **any new text needs both spans** or it will show in both languages. Text that reads the same in both (names, numbers, client names) needs no spans. Attributes can't hold spans, so aria-labels use `data-label-en` / `data-label-es` and the page title uses `data-title-en` / `data-title-es` on `<html>`.

**Locked pages are generated — edit them elsewhere.** `pricing.html`, `confidential-a.html` and `confidential-b.html` hold only encrypted content. Their readable sources, and the script that locks them, live in a separate private repo. To change one: edit its source there, run the lock script, then commit the regenerated file here. Editing the generated file here does nothing useful; it's overwritten on the next lock.

The homepage's pricing section is locked the same way: the table is encrypted into the `<!-- lock:pricing -->` slot in `index.html` and appears in place when the password is entered. The lock script rewrites that slot, so leave it alone; everything else in `index.html` is edited here as normal.

Visitors unlock with a shared password (AES-GCM, key derived with PBKDF2-SHA256). Capitals, spacing and accents don't matter. One unlock opens the homepage pricing and all three locked pages for the rest of that browser tab. Private images are embedded inside the encrypted content, never stored in this repo.

**Colors are variables.** Each page declares a `:root` palette and a dark-mode override. To restyle, change the variables rather than hunting hex codes. Each case study sets its own `--accent` to match its hero gradient, with a lighter value for dark mode.

## Notes

- **Language** follows the browser (Spanish browsers see Spanish, everything else English), with an EN/ES toggle in the nav that overrides it and remembers the choice. `elserch.com/?lang=es` opens straight in Spanish, handy for sharing with clients. Like the theme, it's applied in `<head>` before first paint.
- **Dark mode** follows the OS setting, with a toggle in the nav that overrides it and remembers the choice. A script in `<head>` applies the theme before first paint to avoid a flash.
- **Navigation** is a vertical rail on the right at desktop widths, swapping its words for icons on windows under 760px tall, and a bottom bar with Material icons below 768px wide. Icon-only links keep their labels in the DOM, visually hidden, so they still announce correctly.
- **No external requests.** Icons are inlined SVG rather than an icon font; fonts are the system stack. The site works offline once loaded.
- **Hover styles sit behind `@media (hover: hover)`** so tapped elements don't stay stuck in a hover state on touch devices.

## License

Code is free to borrow. Written content, case studies, and the logo are © Sergio Inurreta — please don't reuse those.
