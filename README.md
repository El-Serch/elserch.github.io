# elserch.github.io

Personal portfolio and online CV for Sergio "El Serch" Inurreta — Product & Cognitive Designer.

**Live at [elserch.com](https://www.elserch.com)**

Static HTML, CSS and a little vanilla JavaScript, served by GitHub Pages. No build step, no framework, no package manager — open a file and edit it.

## Structure

```
index.html                    The whole site: hero, about, projects, pricing (locked in place), contact
pricing.html                  Password-protected: scope options and pricing   (generated, do not edit)
confidential-a.html           Password-protected: project under NDA           (generated, do not edit)
confidential-b.html           Redirect to index.html#p-confidential-b (old page quarantined)
scotiabank-case-study.html    Redirect to index.html#p-scotiabank   (old page quarantined)
nyhealth-case-study.html      Redirect to index.html#p-nyhealth     (old page quarantined)
walmart-case-study.html       Redirect to index.html#p-walmart      (old page quarantined)
assets/elserch-logo.svg       Logo mark — also the favicon
assets/fonts/                 Caveat, the tour's handwriting face (SIL OFL)
assets/projects/<project>/    Project images: card cover and screens
CNAME                         Custom domain for GitHub Pages
```

`index.html` holds its styles in a `<style>` block in the head and its scripts at the end of the body. The other pages are self-contained the same way.

## Running locally

Open `index.html` in a browser. To test relative links and the password unlock exactly as GitHub Pages serves them, use a local server:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## The homepage

Four sections — **About, Portfolio, Pricing, Contact** — plus language, theme and view toggles in the nav.

- **About** has a short bio, three figures and a credentials strip (experience, certifications, patents and publications).
- **Portfolio** is a grid of project cards. Clicking a card hides it and opens its **panel** in its place, full width; only one panel is open at a time, and Scotiabank opens first. `index.html#p-<id>` opens a given project.
- **Pricing** shows a blurred teaser with dummy prices behind the password form; the real table unlocks in place.
- **Contact** is a form (see below) with email, copy-email and LinkedIn as fallbacks.

### Project panels

Each card is an `<a class="project-card" data-project="p-<id>">` followed by its `<section class="project-panel" id="p-<id>">`. A panel is built from a few reusable parts, all optional:

| Part | Class | What it is |
|---|---|---|
| Cover | `.panel-cover` | Copied automatically from the card's `.project-image`, so the image is set once |
| Kicker, title, lede | `.panel-kicker`, `.panel-title`, `.panel-lede` | Client · context · year, a headline, one or two sentences |
| Facts | `.panel-meta` | Role, team, dates, users… as a `<dl>` |
| Diagram | `.panel-flow` | Columns with arrows between them (`--cols: N`); add `.panel-flow--parallel` for side-by-side parts without arrows. A number in `.flow-count` sits before the column title |
| Decisions | `.panel-decisions` | Up to three, numbered |
| Note | `.panel-note` | A short paragraph, e.g. what testing changed |
| Figures | `.panel-stats` | Big numbers with a label |
| Screens | `.panel-shots` | See below |
| Fine print | `.panel-fine` | e.g. "Prototype screens with dummy data" |

**Screens.** `.panel-shots` holds `<figure>`s, each with an `<a href>` to the full image, an `<img>` and a `<figcaption>`. They show as browser windows: the first large, the rest stacked beside it. Clicking a side screen swaps it into the main slot; clicking the main one opens it full size in a modal over a blurred page (Esc, the close button or a click outside closes it). Captions double as the accessible names and follow the language toggle.

**Video.** A `<figure class="panel-video">` holds a `<video controls muted playsinline preload="none" poster="…">` with an MP4 source; nothing downloads until someone presses play. Compress first (e.g. `ffmpeg -i in.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 27 -movflags +faststart out.mp4`) and keep files well under 25 MB.

**Images.** Put them in `assets/projects/<project>/`. For the card cover, replace the initials in `.project-image` with `<img>` (remove the inline gradient). Screens can be any size; about 1200px wide is plenty. Only publish screens with dummy data.

### Content rule

**Nothing goes on the site unless Serch said it or provided it.** No invented team sizes, interview counts or percentages; every figure has a source. The first version's case-study pages broke this rule, so they were quarantined on 2026-10-09: moved to the private repo and replaced here by redirects to each project's panel. A full page comes back only once its project content is approved.

## Bilingual text

Every piece of text is written twice, side by side:

```html
<h2 class="section-title"><span lang="en">Featured Projects</span><span lang="es">Proyectos destacados</span></h2>
```

One CSS rule hides whichever language isn't active, so **any new text needs both spans** or it shows in both languages. Text that reads the same in both (names, numbers, client names) needs no spans. Attributes can't hold spans, so aria-labels use `data-label-en` / `data-label-es` and the page title uses `data-title-en` / `data-title-es` on `<html>`.

Language follows the browser, with an EN/ES toggle that overrides it and is remembered. `elserch.com/?lang=es` opens straight in Spanish.

## Locked content

`pricing.html` and `confidential-a.html` hold only encrypted content, and so do three slots inside `index.html`: `<!-- lock:pricing -->`, `<!-- lock:panel-a -->` and `<!-- lock:panel-b -->` (the two NDA project panels). Their readable sources and the lock script live in a separate private repo. To change one: edit the source there, run the lock script, then commit the regenerated files here. Don't edit inside those slots by hand; the next lock overwrites them.

Visitors unlock with one shared password (AES-GCM, key derived with PBKDF2-SHA256, 600,000 iterations). Capitals, spacing and accents don't matter. One unlock opens pricing, both NDA panels and the locked page for the rest of that browser tab; the NDA cards then show their client initials. Private images travel inside the encrypted content and are never stored in this repo. The password itself is never written in either repo.

"Ask me for it" links go to `index.html?ask=password#contact`, which opens the contact form with the reason pre-filled.

## Contact form

The form posts to [Web3Forms](https://web3forms.com), which emails the message with the visitor's address as reply-to. The access key in the page is meant to be public. hCaptcha guards against spam, and its script loads only when a visitor first focuses or taps the form, so a visit that doesn't use the form makes no request to Web3Forms or hCaptcha. A note under the form says so: the site sets no cookies and has no tracking; hCaptcha may set its own.

A reason switch (role / project / other) changes the fields: a project adds a budget in MXN and a timeline with start and end dates, with inline errors for an end before the start or a date in the past.

## System view

The view toggle in the nav (or `?view=system`) turns the page into a labelled blueprint: every component gets a tag in code-editor colours, and a page map sits on the left at wide screens. It also lets visitors try to redesign the page — reorder sections and projects, hide projects, choose which opens first and edit the hero copy (with a profanity filter). Changes carry over to the normal view for that browser tab, are counted, and Reset puts everything back.

## First-visit tour

On a first visit a few handwritten notes and arrows (Caveat, self-hosted in `assets/fonts/` under the SIL Open Font License) point at the nav, the view toggle, the language and theme toggles and the main button. They can't be clicked, are hidden from screen readers, and vanish on the first scroll, click or key press. They show once per browser tab; `?tour=1` shows them again.

## Accessibility

- Colours are variables with a dark-mode override, and contrast passes in both themes.
- Everything works with the keyboard; focus is always visible.
- The screens modal is a native `<dialog>`: focus moves in and back out, the page behind is inert and doesn't scroll, the image area scrolls with the arrow keys, and the close button is 44px.
- Motion is reduced or removed when the OS asks for reduced motion.
- Hover styles sit behind `@media (hover: hover)` so tapped elements don't stay stuck on touch devices.

## Notes

- **Dark mode** follows the OS, with a toggle that overrides it and is remembered. Theme and language are applied in `<head>` before first paint, so there's no flash.
- **Navigation** is a vertical rail on the right at desktop widths (words become icons on short windows) and a bottom bar below 768px. In system view the section links get drag handles to reorder them.
- **External requests:** none on a normal visit. Web3Forms and hCaptcha load only once someone uses the contact form. The tour's handwriting face is self-hosted and downloads only when the tour shows; icons are inline SVG and everything else uses the system font stack.

## License

Code is free to borrow. Written content, project material and the logo are © Sergio Inurreta — please don't reuse those.
