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

- `/` — Single-page portfolio. Hero, About, Skills, Experience, Contact sections all render on one page. Navigation uses anchor links (`#about`, `#skills`, `#experience`, `#contact`), not Next.js routing.
- `/how-its-built` — Separate route (`src/app/how-its-built/page.tsx`), a technical deep-dive on the infrastructure.

**Component pattern**: Pages in `src/app/` compose reusable components from `src/components/`. Each component has a co-located CSS Module file (e.g., `Hero.tsx` + `Hero.module.css`).

**Styling**: CSS Modules with CSS variables defined in `globals.css`. No Tailwind or CSS framework. Global utility classes `.container` (max-width 1200px) and `.btn` are defined in `globals.css`.

CSS custom properties:

- `--primary: #0070f3`, `--primary-dark: #0051a8`
- `--background: #0a0a0a`, `--background-light: #111111`
- `--text: #ededed`, `--text-secondary: #888888`
- `--border: #333333`, `--accent: #00d4ff`

**Data in components**: Skills, experience, and other content data are defined as arrays/objects at the top of component files, then mapped for rendering.

**Static assets**: `public/headshot.jpg` (used via `next/image` with priority) and `public/resume.pdf` (direct download link). Use `next/image` for any new images, not `<img>`.

**Standalone output**: `next.config.js` sets `output: 'standalone'`, so the production build produces `.next/standalone/server.js`. The Docker CMD runs `node server.js` directly, not `next start`.

## Deployment

Push to `main` triggers GitHub Actions which:

1. Builds Docker image (amd64) via Buildx
2. Pushes to Docker Hub with tags `ga-YYYY.MM.DD-HHMM` and `latest`
3. Updates `eks-helm-charts/fuhriman-chart/values.yaml` with new image tag (using `yq`)
4. ArgoCD syncs to k3s cluster

Required GitHub secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GH_PAT` (repo scope for updating eks-helm-charts).

Related repos: `furryman/terraform`, `furryman/eks-helm-charts`, `furryman/argocd-app-of-apps`
