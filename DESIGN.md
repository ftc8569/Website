# RoboKnights design system

Dark, Apple product-page layout. All tokens live at the top of
`app/globals.css`; shared building blocks live in `components/site/ui.tsx`.
Dark mode only.

## Colour

| Token           | Value                   | Use                                     |
| --------------- | ----------------------- | --------------------------------------- |
| `--bg`          | `#000`                  | Page                                    |
| `--surface`     | `#0b0b0c`               | Alternate sections, footer              |
| `--card`        | `#141416`               | Tiles                                   |
| `--hairline`    | `rgba(255,255,255,.08)` | Dividers                                |
| `--text`        | `#f5f5f7`               | Headlines, body emphasis                |
| `--text-2`      | `#a1a1a6`               | Sub-headlines, body copy                |
| `--text-3`      | `#86868b`               | Captions (13px+)                        |
| `--accent`      | `#ff2d7a`               | Links and one highlight per section     |
| `--accent-fill` | `#e0186a`               | Primary button fill (white text, 4.7:1) |

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

## Texture kit (all decorative, static, ≤6% opacity)

Defined at the end of `app/globals.css`.

- **Grain:** static SVG noise over the whole page at 4%, normal blend
  (overlay and soft-light do nothing on pure black). Off under reduced motion.
- **CAD grid** (`.tex-cad`): 8px/40px blueprint grid, radially masked, behind
  Robot and Software sections.
- **Brushed aluminium** (`.tex-alu`): stat strips and the spec grid,
  #141416 → #1a1a1d.
- **Perforated channel** (`.perf-band`, footer): rows of holes.
- **Field tiles** (`.tex-field-section`): foam-tile edges behind the Season
  timeline.
- **Gaffer tape** (`components/site/tape.tsx`): one strip per page, on an edge
  away from text.
- **Tiles**: 1px lit top edge plus a soft shadow.

## Images and contrast

- Priority: close shop action shots, competition moments, CAD renders, macro
  part shots, data visuals, then tight group shots. No stock, AI images,
  slide screenshots or ceiling-dominated photos.
- One shared grade on every photo: highlights −8%, slightly warmer, +5%
  contrast, blacks lifted to #0b0b0c (a `lighten` overlay), light vignette.
- CAD renders and plots sit on `--inset` (#1a1a1d) with 24px padding.
- Text on photos uses directional scrims from the text corner, never a flat
  overlay. Under 735px the hero text moves below the photo onto black.
- Contrast is checked by sampling the photo pixels under each text box
  (95th-percentile brightest pixel, 4.5:1, or 3:1 for large text).
- `/dev/images` (development only) shows every graded photo side by side.

## Motion

GSAP + ScrollTrigger + Lenis (≈52KB gzip), loaded only after the visitor's
first scroll, touch, key or pointer move (`components/motion/load.ts`), so
they never block page load. Easing `expo.out`, 400–900ms. Everything is off
under `prefers-reduced-motion`; content is always visible without JS.

- Home hero: the robot is `position: sticky` for 120vh (no JS pin, so no layout
  shift). It turns half a turn, then the four subsystem CAD renders fly out
  with labels and come back. The GLB is a single mesh, so the explode uses
  renders, not the model's parts.
- Headlines (`SplitHeading`) slide up line by line; stats (`Odometer`) roll
  digit by digit. Both are React components, never DOM rewrites, and leave
  anything already on screen at load untouched.
- Home gallery pins and scrolls sideways (desktop); a swipe row elsewhere.
- Parallax photos, slide-in timeline events, sequenced iteration rows with
  self-drawing arrows, a self-drawing state machine, equation rows, code
  lines highlighted on scroll, NC map dots, blur-to-sharp portraits.
- Spotlight + 2–3° tilt on hover tiles, magnetic primary buttons, a progress
  line in the local nav, and title morphs between pages (React
  `<ViewTransition>`).
- Crossfading tiles and the sponsor marquee pause off-screen, on hover, and
  have a pause button.

The home 3D model loads only when near the viewport and after first input,
auto-rotates slowly until touched, and never captures the scroll wheel. Zoom
is pinch, the +/− buttons or the keyboard. Reduced motion, Save-Data and
2G/3G connections keep the poster image.

## Copy

Short, specific, first person plural, real numbers and names, what broke and
what we changed. No fact-free slogans, numbered section labels
("00 / Mission"), "X. Y. Z." triplets, "not just X but Y", or more than one
em dash per paragraph. Only publish numbers with a source and a timeframe.
