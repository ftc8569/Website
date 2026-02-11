# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Official website for FTC Team 8569 (RoboKnights) from NCSSM. Built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, and Prisma 6 with PostgreSQL.

## Commands

- **Dev server:** `npm run dev` (runs on http://localhost:3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Format:** `npm run format` (Prettier)
- **Docker build:** `npm run docker:build` (reads version from package.json)
- **Docker push:** `npm run docker:push`
- **DB migrations:** `npm run prisma:deploy` (uses `prisma db push`)
- **Generate Prisma client:** `npx prisma generate`
- **Create admin user:** `npm run createAdminUser`

### Local Database Setup

```bash
docker run --name roboknights-db -p 5432:5432 -e POSTGRES_PASSWORD=temporarypass -e POSTGRES_DB=blog -e POSTGRES_USER=web -d postgres
```

Copy `.env.example` to `.env` and fill in values before running.

## Architecture

### Routing (Next.js App Router)

- `/` — Homepage (client component, single-page with scroll sections)
- `/blog` — Blog listing (client component)
- `/blog/[id]` — Individual blog post (server component, fetches from Prisma)
- `/api/contact-us` — Contact form POST handler (reCAPTCHA + nodemailer via Gmail OAuth2)

### Homepage Structure

The homepage (`app/page.tsx`) is a single-page layout with ref-based scroll navigation. Each section is a separate component in `components/home/`. The navbar (`components/navbar.tsx`) uses scroll detection to highlight the active section.

A canvas-based particle animation runs via a Web Worker (`components/home/animation.worker.ts`) for performance. The robot animation (320 Blender-rendered PNG frames in `public/robot/`) is currently disabled.

### Blog System

Admin dashboard (`components/admin/`) supports creating/editing posts with image upload+crop and markdown content. Blog images are stored as bytes directly in PostgreSQL (not the filesystem). Markdown is rendered with `markdown-it`.

### Data

- **Team data:** `public/team/team.yml` (YAML, parsed at runtime)
- **Database models:** `prisma/schema.prisma` — `BlogPost` (with image bytes, markdown content) and `User` (argon2 password hashing)

### Deployment

Dockerized with multi-stage build (standalone Next.js output). Deployed to Kubernetes (`kubernetes.yml`). Docker image registry: `docker.bedson.tech/tbedson/roboknights`.

## Code Style

- **Prettier:** No semicolons, no trailing commas, double quotes, 80 char width
- **ESLint:** Extends `next/core-web-vitals`, `next/typescript`, `prettier`. `react/no-unescaped-entities` is off.
- **Path alias:** `@/*` maps to project root
- **Custom Tailwind colors:** `roboHotPink` (#dd1c8a), `roboGray` (#232323), `roboPink` (#e383b6)

## Build Notes

`next.config.mjs` has `ignoreBuildErrors: true` (TypeScript) and `ignoreDuringBuilds: true` (ESLint) — type and lint errors won't fail the build.
