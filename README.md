# RoboKnights website

The website for FTC Team 8569 at NCSSM Durham. Built with Next.js 16 App Router,
React 19, TypeScript, Tailwind CSS 4, Three.js, KaTeX, and Prisma/PostgreSQL.

## Run locally

Use Node.js 20.9 or newer. Install dependencies and generate the Prisma client:

```sh
npm ci
npx prisma generate
npm run dev -- --port 8569
```

Open http://localhost:8569. The public home, robot, software, outreach, and team
pages work without service credentials. Team data is read from
`public/team/team.yml`; shared technical/outreach content is in
`components/home/content.ts`. Treat season results and measurements as dated
team-supplied portfolio data and verify them before updating.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm run test:browser -- http://localhost:8569
npm run test:cad -- http://localhost:8570
npm run audit:react
```

The browser check uses installed Google Chrome via Playwright and runs the six
public pages at 375, 768, and 1280 pixels. It checks route/history/hash navigation,
mobile menus, horizontal overflow, MathML, reduced motion, no-JavaScript content,
invalid contact requests, runtime exceptions, and axe accessibility rules.
The CAD check exercises stationary controls, touch/keyboard/reset actions, and
poster fallback when the model download fails.
Screenshots and reports are written to ignored `output/playwright/`.
Run it against the production server as well as the dev server.

For a local production check, run `npm run build` followed by
`npm run start -- --port 8570`. The Docker deployment uses the generated
standalone server with its public/static assets, as configured in `Dockerfile`.

Development-only React Grab and React Scan load through
`components/site/dev-tools.tsx`. Set `NEXT_PUBLIC_DISABLE_REACT_DEVTOOLS=1` before
starting dev to disable instrumentation during timing measurements.

## Services

Copy `.env.example` to `.env.local` and set only the services you need. Never
commit credentials. Public pages do not require a database; blog reads require
`DATABASE_URL` pointing to PostgreSQL and an applied Prisma schema. List, detail,
and image endpoints expose only published posts. With the database unavailable,
the site shows a service-unavailable message rather than an empty or broken page.
The legacy editor is not exposed as an authenticated admin route by this branch.

The legacy contact form requires `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`,
`GOOGLE_API_KEY`, `CONTACT_EMAIL`, `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, and
`GMAIL_CLIENT_REFRESH_TOKEN`. Its assessment uses the existing reCAPTCHA
Enterprise project `prorickey` and action `form_submit`. The Gmail OAuth sender
must be authorized for `ftcteam8569@roboknights.net`. Delivery is awaited before
success is reported. The redesigned contact CTA opens an email client directly.
Do not test successful mail delivery without explicitly authorizing that send.

## Structure

- `app/(site)/`: home, robot, software, outreach, and team routes.
- `components/site/`: shared navigation, shell, page headers, math, dev tooling.
- `components/home/robot-viewer.tsx`: responsive CAD viewer with poster fallback.
- `app/blog/`, `app/api/blog/`: public published-article routes.
- `app/api/contact-us/`: validated legacy contact handler.
- `public/models/`: compressed robot GLB, poster, and local Draco decoder assets.
- `public/robot/`: legacy Blender frame sequence, retained for compatibility.
- `DESIGN.md`: styling, motion, responsive behavior, and accessibility contract.
