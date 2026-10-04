# RoboKnights design system

## 1. Atmosphere & identity

Preserve the redesign branch's engineering showcase: black surfaces, hot pink
signals, large Poppins headlines, grayscale team photography, and a dimensional
CAD robot. The existing SiteShell, PageHeader, figure and stat patterns are the
component system. Visitors are prospective students, sponsors, families, and
robotics teams looking for technical resources. Repairs prioritize readable
content and predictable navigation while keeping this identity.

## 2. Color

Existing launch-site palette: ink `#050505`, raised surface `#080508`, primary
text `#f7f7f4`, muted text `#9d9d9d`, pink `#ff2b87`, soft pink `#ff8dbc`, mission surface `#050505` and mission text `#f7f7f4`. Dividers use white at
12–18% opacity; navigation uses black at 90% with backdrop blur. Muted content
on dark surfaces must use at least `#9d9d9d`. Controls on pink use dark text.
Legacy tokens remain roboHotPink `#dd1c8a`, roboPink `#e383b6`, roboGray `#232323`.

## 3. Typography

Poppins, system-ui, sans-serif is the body/display family; monospace is limited
to engineering labels. Body sizes 14/16/18/20px with 1.6–1.75 line height;
captions 12px; navigation 14px; headings 24/28/38px and fluid display sizes
38–84px or 48–124px for the hero. Long prose has a 65–72ch measure. Balance
headings, wrap prose naturally, and isolate equations in horizontally scrollable
blocks with accessible MathML instead of shrinking them to unreadable sizes.

## 4. Spacing & layout

Use the existing 4px rhythm: 4/8/12/16/20/24/28/32/40/48/64/80/96px. Content
uses the existing max(7vw, 28px) gutter; mobile gutters may use 20px. Navigation
is centered, capped at 1180px, with a 68px minimum height and 18px top inset.
Breakpoints: 520px narrow phones, 900px menu/stacking, 1100px technical grids.
Grid tracks must fit the available container using minmax(min(...,100%),1fr).
Main document owns scrolling; equations and navigation drawers own local
overflow. Anchors clear fixed navigation with a 112px scroll margin.

## 5. Components

- **SiteShell/navigation**: logo/home link, route links, contact anchor, mobile
  toggle and footer. States: rest, scrolled, hover, focus, current, mobile open,
  pending navigation. Use aria-current, aria-expanded, a labelled nav, Escape
  and outside dismissal, focus restoration, and unavailable closed menu items.
- **PageHeader**: index, single h1, lede, optional background photograph. Fluid
  spacing/type and readable image overlay. Each route has a unique title.
- **CTA/resource link**: inline cluster with ArrowIcon. Default, hover, active,
  focus-visible. Real anchors preserve native modified clicks and new tabs.
- **Figures/technical cards**: responsive image, caption, prose. Preserve image
  aspect ratio, wrap long labels, and use real list semantics where appropriate.
- **CAD viewer**: poster, WebGL stage, loading/error status and interactive
  controls. Fit camera to container; support touch and keyboard; preserve page
  scrolling; pause offscreen; bound zoom; handle unavailable WebGL/model errors.
- **Loader**: logo boot sequence retained with CSS failsafe dismissal, decorative
  progress, and skip control. Never block access indefinitely or announce every
  decorative percentage to screen readers.
- **Team tabs/cards**: keyboard-operable labelled controls with selected state;
  real portraits or initials, role metadata and resilient empty groups.
- **Equations**: KaTeX HTML and MathML, no executable user input, explicit
  variable definitions/units and local horizontal overflow on small screens.

Existing components and their states serve as the state harness; QA captures
them on actual routes at 375px, 768px, and 1280px before final sign-off.

## 6. Motion & interaction

Micro feedback 150ms, menu/link feedback 200–300ms, route entry 450ms with
cubic-bezier(0.16,1,0.3,1). Route animation uses opacity and a small vertical
transform; the persistent navbar communicates the current destination. Loading
feedback uses opacity/transform and is dismissed on actual route completion.
No delayed navigation interception: native Next.js Link handles routing. Boot
sequence remains about 2.5s with a skip action. Reduced motion disables animated
travel and decorative loops and presents content immediately. Observer-driven
reveals unobserve visible content and retain a no-JavaScript fallback.

## 7. Depth & surface

Keep the existing mixed recipe: subtle pink translucent borders, black tonal steps,
pink halos behind the robot, and a blurred navigation surface. The user requested removal of gray page backgrounds and cards: remove the
full-page gray noise overlay and keep mission/cards dark. Avoid introducing
new card shapes or aesthetic treatments unrelated to the current branch.

## 8. Accessibility constraints & accepted debt

Target WCAG 2.2 AA: visible focus, keyboard reachability, labelled controls,
4.5:1 body contrast, 3:1 large text, reduced motion, and a skip-to-content link.
Touch controls have at least 44px targets. No horizontal document overflow at
375px. Closed drawers contain no keyboard stops. Keep route/hash navigation,
back/forward, direct URLs and no-JavaScript content working.

No new debt accepted. External mail, database-backed blog data, and remote
resources require their respective services; document measured test limits in
the QA report rather than implying their end-to-end delivery was tested.
