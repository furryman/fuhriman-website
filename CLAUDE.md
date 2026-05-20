# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm install      # First-time setup
npm run dev      # Start development server at localhost:3000
npm run build    # Production build (standalone output)
npm run start    # Start production server
npm run lint     # Run linting (Next.js built-in ESLint, no custom config)
```

There is no test framework configured and no `npm test` script. No `.env` file is needed — the app has zero environment variables.

Docker (multi-stage build on Node 20 Alpine, uses `npm ci`):

```bash
docker build -t furryman/fuhriman-website:latest .
docker run -p 3000:3000 furryman/fuhriman-website:latest
```

## Architecture

This is a Next.js 14.2.0 portfolio website using the App Router with TypeScript strict mode.

**Path alias**: `@/*` maps to `./src/*`

**Pages**:

- `/` — Single-page portfolio. Hero, About, Philosophy, Skills, Experience, Resume CTA, and Contact sections all render on one page. Navigation uses anchor links (`#about`, `#philosophy`, `#skills`, `#experience`, `#contact`), not Next.js routing. A floating pill-shaped navbar is pinned to the top with active section highlighting via Intersection Observer.
- `/how-its-built` — Separate route (`src/app/how-its-built/page.tsx`), titled "How I Built This", a technical deep-dive on the infrastructure. Inherits global styles but has its own CSS module.

**Component pattern**: Pages in `src/app/` compose reusable components from `src/components/`. Each component has a co-located CSS Module file (e.g., `Hero.tsx` + `Hero.module.css`).

**Styling**: CSS Modules with CSS variables defined in `globals.css`. No Tailwind or CSS framework. Global utility classes `.container` (max-width 1100px), `.btn`, `.gradient-text`, `.reveal`, and `.stagger` are defined in `globals.css`.

**Typography**: DM Serif Display (headings, weight 400 only) + Source Sans 3 (body) loaded via `next/font/google` in `layout.tsx` and exposed as `--font-heading` and `--font-body` CSS variables.

**Design system** — Purple/charcoal glass-morphism theme:

- `--background: #0c0c14`, `--background-light: #161525`, `--background-card: #1a1830`
- `--accent: #7c6af0`, `--accent-light: #a78bfa`, `--accent-muted: rgba(124, 106, 240, 0.1)`
- `--text: #e8e6f0`, `--text-bright: #f5f3ff`, `--text-secondary: #9d9bb0`
- `--border: rgba(124, 106, 240, 0.12)`, `--border-hover: rgba(124, 106, 240, 0.4)`
- `--gradient-text: linear-gradient(135deg, #7c6af0 0%, #c084fc 50%, #38bdf8 100%)`
- Body has a gradient background with ambient purple/blue glow orbs via `::before`/`::after`
- Cards use glass-morphism: semi-transparent backgrounds + `backdrop-filter: blur(8px)` + purple borders

**Animations**: CSS-only scroll reveal system. `ScrollReveal.tsx` is a `'use client'` wrapper using Intersection Observer that adds a `visible` class. Supports staggered children via the `.stagger` class. No animation dependencies.

**Numbered section headings**: CSS counters scoped to `main.portfolio section[id] h2` — sections without an `id` (like Resume CTA) don't get numbered.

**Icons**: `src/components/Icons.tsx` contains all SVG icon components — brand icons (AWS, Kubernetes, Terraform, GitHub Actions, Prometheus, Code) and social icons (GitHub, LinkedIn, Email). No icon library dependencies.

**Navbar**: `src/components/Navbar.tsx` is a `'use client'` component — floating centered pill (`border-radius: 9999px`) with glass background, always pinned to top (no hide-on-scroll). Active section highlighting via Intersection Observer. Numbered links (01–05), "How I Built This" link, and pill-shaped Resume button.

**Data in components**: Skills, experience, and other content data are defined as arrays/objects at the top of component files, then mapped for rendering.

**Static assets**: `public/headshot.jpg` (used via `next/image` with priority, opacity 0.9, hidden below 768px), `public/resume.pdf` (linked from navbar and Resume CTA section), and `public/favicon.svg` (AF initials in purple on dark background). Use `next/image` for any new images, not `<img>`.

**Standalone output**: `next.config.js` sets `output: 'standalone'`, so the production build produces `.next/standalone/server.js`. The Docker CMD runs `node server.js` directly, not `next start`.

## Deployment

Push to `main` triggers GitHub Actions which:

1. Builds Docker image (amd64) via Buildx
2. Pushes to Docker Hub with tags `ga-YYYY.MM.DD-HHMM` and `latest`
3. Updates `eks-helm-charts/fuhriman-chart/values.yaml` with new image tag (using `yq`)
4. ArgoCD syncs to k3s cluster

Required GitHub secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GH_PAT` (repo scope for updating eks-helm-charts).

Related repos: `furryman/terraform`, `furryman/eks-helm-charts`, `furryman/argocd-app-of-apps`
