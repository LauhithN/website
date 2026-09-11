# Lauhith Natarajan — portfolio

Personal website for a business and data analyst in Toronto.

Live: https://website-two-sepia-48.vercel.app/

## Structure

The site is static: HTML, CSS and a small dependency-free script. There is no installation or build step.

- `index.html`: profile, four projects, experience, contact and page metadata.
- `styles.css`: shared light/dark colour tokens, typography, responsive layouts and print styles.
- `script.js`: current-section navigation, restrained entry motion and accessible dashboard annotations.
- `assets/work/`: original dashboard and app screenshots in WebP format.
- `assets/og.png`: existing social preview, preserved with its metadata.

## Design

A navy and blue editorial palette, Schibsted Grotesk body text and an Instrument Serif headline. The first screen features a real dashboard. Projects show their summary, findings and links up front, with role, data and annotated notes in native expandable details. Every screenshot has a full-size image link.

Light and dark modes follow the system setting. Motion respects reduced-motion preferences. Navigation, project details, resume and contact links work without JavaScript; image annotation buttons appear only when their handlers are ready. Printing with JavaScript includes all project notes and restores the reader's expanded sections afterward.

## Editing projects

Each project is an `<article class="case">`. Preserve its ID, heading ID and link targets. Marker positions use percentages relative to the screenshot; marker 1 corresponds to the first `.notes li`. Keep the marker's `aria-describedby` pointed to its note and `aria-controls` pointed to its project's `<details>` element.

Use the existing project evidence when editing results. Distinguish projected benefits from measured outcomes.

## Local preview

```sh
python3 -m http.server 8000
```

Open http://localhost:8000/. `serve-local.ps1` is also available for Windows.

## Interaction checks

Run `node tests/interactions.cjs` to check annotation, navigation, reduced-motion, fallback and print behavior in a small DOM stub. These checks do not replace browser visual testing.
