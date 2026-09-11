# Lauhith Natarajan — personal site

Business & data analyst in Toronto. Live at https://website-two-sepia-48.vercel.app/

## What it is

A single page, hand-written in HTML, CSS and JavaScript. No framework, no build step,
no analytics. Fonts (Archivo, Geist Mono) are self-hosted, so the whole page is one HTML
file, one stylesheet, one script and a handful of WebP screenshots.

Things worth knowing about:

- **Hero**: a canvas of "noise" that converges into the name, with cursor repulsion.
  The dots dissolve again as you scroll.
- **Work**: four real projects as scroll-pinned panels. Each opens a case study with an
  annotated figure (numbered markers linked to notes); the card image morphs into the
  figure using the View Transitions API where supported.
- **Motion**: masked text reveals, a word-by-word fill on scroll, count-up numbers, a
  custom cursor and magnetic buttons, eased wheel scrolling. All of it is disabled when
  `prefers-reduced-motion` is set, and the page reads fine with JavaScript off.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/. (`serve-local.ps1` does the same on Windows.)

## Files

```
index.html        content and structure
styles.css        design tokens, layout, motion
script.js         enhancements (all optional)
assets/work/      project screenshots (WebP)
assets/fonts/     Archivo (variable), Geist Mono
assets/og.png     social preview image
```
