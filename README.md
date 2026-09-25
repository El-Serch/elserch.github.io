# elserch.github.io

Personal portfolio and online CV for Sergio "El Serch" Inurreta — Product & Service Designer.

**Live at [elserch.com](https://www.elserch.com)**

Static HTML and CSS, served by GitHub Pages. No build step, no framework, no package manager — open a file and edit it.

## Structure

```
index.html                    Homepage: hero, about, skills, project grid, experience, contact
scotiabank-case-study.html    Corporate & commercial banking platform (2022–present)
usaa-case-study.html          CFO treasury applications (2022–2023)
nyhealth-case-study.html      Health Pass + virtual assistant (2021)
banorte-case-study.html       "Maya" virtual banking assistant (2017–2019)
walmart-case-study.html       LATAM HR change management (2019)
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

**Colors are variables.** Each page declares a `:root` palette and a dark-mode override. To restyle, change the variables rather than hunting hex codes. Each case study sets its own `--accent` to match its hero gradient, with a lighter value for dark mode.

## Notes

- **Dark mode** follows the OS setting, with a toggle in the nav that overrides it and remembers the choice. A script in `<head>` applies the theme before first paint to avoid a flash.
- **Navigation** is a vertical rail on the right at desktop widths, and a bottom bar with Material icons below 768px. Icon-only links keep their labels in the DOM, visually hidden, so they still announce correctly.
- **No external requests.** Icons are inlined SVG rather than an icon font; fonts are the system stack. The site works offline once loaded.
- **Hover styles sit behind `@media (hover: hover)`** so tapped elements don't stay stuck in a hover state on touch devices.

## License

Code is free to borrow. Written content, case studies, and the logo are © Sergio Inurreta — please don't reuse those.
