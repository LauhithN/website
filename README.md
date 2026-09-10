# lauhith.dev, sort of

Personal site for Lauhith Natarajan, business and data analyst in Toronto.

Live: https://website-two-sepia-48.vercel.app/

## What it is

One HTML page, one stylesheet, one small script. No build step, no framework.

- `index.html` is the content. Edit text there.
- `styles.css` holds the design tokens (colours, type, spacing) at the top, then layout.
- `script.js` adds the small touches: header hairline on scroll, reveal on scroll,
  current-section highlight in the nav, and the numbered markers on each figure.
  Everything works with JavaScript off.
- `assets/work/` holds the project figures. They are real screenshots of the
  dashboards and apps, saved as WebP at 1400px wide.
- `assets/og.png` is the social preview image.

## Design notes

- Light "paper" palette with a single vermilion accent. Dark mode follows the
  system preference.
- Type: Newsreader for headings, Instrument Sans for text, DM Mono for labels,
  all from Google Fonts.
- Each project is presented like a figure in a report: the real screenshot,
  numbered markers on the points worth discussing, and the role, data and
  result beside it.

## Editing a project

Each project is an `<article class="case">` in `index.html`. To move a marker,
change its `left` and `top` percentages (measured from the top-left of the
image). Marker `n` pairs with the `n`th item in that project's notes list.

## Running locally

Any static server works, for example:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/. On Windows, `serve-local.ps1` does the same.
