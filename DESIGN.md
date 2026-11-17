# RoboKnights design system

Dark, Apple product-page layout. All tokens live at the top of
`app/globals.css`; shared building blocks live in `components/site/ui.tsx`.
Dark mode only.

## Colour

| Token            | Value                    | Use                                        |
| ---------------- | ------------------------ | ------------------------------------------ |
| `--bg`           | `#000`                   | Page                                       |
| `--surface`      | `#0b0b0c`                | Alternate sections, footer                 |
| `--card`         | `#141416`                | Tiles                                      |
| `--hairline`     | `rgba(255,255,255,.08)`  | Dividers                                   |
| `--text`         | `#f5f5f7`                | Headlines, body emphasis                   |
| `--text-2`       | `#a1a1a6`                | Sub-headlines, body copy                   |
| `--text-3`       | `#86868b`                | Captions (13px+)                           |
| `--accent`       | `#ff2d7a`                | Links and one highlight per section        |
| `--accent-fill`  | `#e0186a`                | Primary button fill (white text, 4.7:1)    |

Two deliberate departures from the original brief, both for WCAG AA:
captions use `#86868b` instead of `#6e6e73` (4.1:1 on black), and filled
buttons use `#e0186a` because white on `#ff2d7a` is only 3.6:1. Never use the
accent for whole headlines or large blocks.

## Type

`"SF Pro Display", -apple-system, Inter, sans-serif` (Inter loaded via
`next/font` as the fallback). Hero `clamp(48px, 8vw, 96px)/1.05`, weight 700,
`-0.03em`. Section headline `clamp(36px, 5vw, 56px)`. Sub-headline 19–24px in
`--text-2`. Body 17px/1.5. Captions 13–14px. Stats use tabular numbers.

## Layout

- Text width 980px (`.wrap`), media width 1200px (`.wrap--media`).
- Section padding 120px desktop, 72px under 735px.
- One idea per section, centred headers (`SectionHead`).
- Tiles: `#141416`, 28px radius, no border, 40px padding (`.tile`).
  Variants: `.tile--media` (photo bleeds to the top), `.tile--split`
  (two-column feature).
- Grids: `.grid--2/3/4`, 16px gap, equal heights.
- Photos: 20px radius, full colour, no filters. Darken only behind text, with
  a bottom gradient (0% → 70% black) on `PageHero`.
- CAD renders and plots sit on an inset (`.media--render`, `.media--light`)
  with `object-fit: contain` instead of being cropped.

## Components (`components/site/`)

- `navigation.tsx`: 48px bar, `rgba(0,0,0,.72)` + 20px blur. Logo left,
  Season · Robot · Software · Outreach · Team · Blog, pink "Contact" pill
  right. Full-screen menu under 834px (Escape closes, focus returns).
- `ui.tsx`: `PageHero`, `PageHead`, `SectionHead`, `LocalNav` (44px sticky
  in-page nav: page name, anchors, one action), `Stats`, `MoreLink`
  (text link with ›), `Silhouette` (placeholder for missing photos).
- `photo-grid.tsx`: static 3×2 grid with a native `<dialog>` lightbox.
- `season-timeline.tsx`: one-column tiles on a thin rail.
- `contact-form.tsx`: labelled 52px fields, honeypot, mailto fallback.

Buttons: one pill primary (`.btn`, 44px) per group. Secondary actions are text
links (`.more`). Never two primaries side by side.

## Motion

Fade-up 16px over 500ms, once, armed by `SiteShell` only after JavaScript
loads; reduced motion shows everything immediately. Numbers are rendered as
their final values in the HTML and are never counted up from 0.

The home 3D model loads only when near the viewport, auto-rotates slowly until
the first interaction, and never captures the scroll wheel. Zoom is pinch,
the +/− buttons or the keyboard. Reduced motion, Save-Data and 2G/3G
connections keep the poster image.

## Copy

Short, specific, first person plural, real numbers and names, what broke and
what we changed. No fact-free slogans, numbered section labels
("00 / Mission"), "X. Y. Z." triplets, "not just X but Y", or more than one
em dash per paragraph. Only publish numbers with a source and a timeframe.
