# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run linting
```

Docker:
```bash
docker build -t furryman/fuhriman-website:latest .
docker run -p 3000:3000 furryman/fuhriman-website:latest
```

## Architecture

This is a Next.js 14 portfolio website using the App Router with TypeScript strict mode.

**Path alias**: `@/*` maps to `./src/*`

**Component pattern**: Pages in `src/app/` compose reusable components from `src/components/`. Each component has a co-located CSS Module file (e.g., `Hero.tsx` + `Hero.module.css`).

**Styling**: CSS Modules with CSS variables defined in `globals.css`. Dark theme with primary color `#0070f3` and accent `#00d4ff`.

**Data in components**: Skills, experience, and other content data are defined as arrays/objects at the top of component files, then mapped for rendering.

## Deployment

Push to `main` triggers GitHub Actions which:
1. Builds ARM64 Docker image
2. Pushes to Docker Hub with tag `ga-YYYY.MM.DD-HHMM`
3. Updates `eks-helm-charts` repo with new image tag
4. ArgoCD syncs to k3s cluster

Related repos: `furryman/terraform`, `furryman/eks-helm-charts`, `furryman/argocd-app-of-apps`
