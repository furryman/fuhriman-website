# AGENT.md

Framework-agnostic agent guide. Use this if you're Codex, Cursor, Aider, or any other AI coding assistant. (Claude Code: see `CLAUDE.md` for the deeper version.)

## TL;DR

- **Stack**: Next.js 16 (App Router) · React 19 · TypeScript 6 · pnpm 11 · Biome 2 · Vitest 4 · Playwright · Lighthouse CI
- **Visual**: warm dark theme (`#1a1818` bg, `#f0a868` amber, `#f8f4ed` cream), animated mesh + constellation background, 3D K8s hero (Three.js + R3F), ⌘K command palette (cmdk), Motion-based scroll reveals + tilt cards + magnetic buttons
- **Deploy**: GHA → Docker Hub (amd64, distroless, Trivy v0.69.3 scan) → eks-helm-charts → ArgoCD → k3s

## Repository layout

```
src/
  app/
    layout.tsx              # Root: mounts AmbientBackground + CommandPalette + ViewTransition wrapper
    page.tsx                # Single-page portfolio composing all sections
    globals.css             # CSS variables, body gradient, hover micro-interactions, view-transition keyframes
    how-its-built/          # Secondary route: technical deep-dive page
  components/               # Each component co-located with .module.css + .test.tsx
    AmbientBackground.*     # Fixed background: mesh gradient + canvas constellation
    Navbar.*                # Floating pill nav with active-section highlight + ⌘K trigger
    Hero.*                  # Layered: 3D HeroScene behind, headshot front-and-center
    HeroScene.*             # Three.js + R3F K8s cluster (lazy-loaded, ≥1024px only)
    ScrollReveal.*          # Motion's whileInView wrapper
    TiltCard.*              # ±2° perspective tilt on hover
    MagneticButton.*        # Polymorphic <a>/<button> with mousemove translate
    CommandPalette.*        # cmdk-based palette, ⌘K trigger
    About.*, Philosophy.*, Skills.*, Experience.*, Projects.*, Interests.*, Resume.*, Contact.*, Footer.*
    Icons.*                 # Decorative SVGs (aria-hidden), no icon library
.github/
  workflows/
    build-deploy.yaml       # Lint, typecheck, test, build, e2e, lighthouse, docker, deploy
    interests-refresh.yaml  # Weekly cron: Spotify + Steam → public/*.json → triggers build-deploy via GH_PAT push
  actions/setup/            # Composite action: pnpm + node-version-file
scripts/
  refresh-spotify.ts        # Used by interests-refresh GHA
  refresh-steam.ts          # Same
  get-spotify-refresh-token.ts  # One-time OAuth helper for SPOTIFY_REFRESH_TOKEN
public/
  spotify-top.json          # Read by Interests at build time; refreshed weekly
  steam-recent.json         # Same
  headshot.jpg, resume.pdf, favicon.svg
tests/e2e/                  # Playwright smoke (.e2e.ts suffix — Vitest skips these)
docs/                       # spotify-setup.md, modernization-notes.md
biome.json                  # Lint + format config (replaces ESLint + Prettier + Stylelint)
vitest.config.ts            # 95/95/95/95 coverage gate, documented exclusions
playwright.config.ts        # webServer: pnpm start, chromium project
lighthouserc.json           # Lighthouse CI budgets
```

## Commands

```bash
pnpm install              # First-time setup
pnpm dev                  # Development server at :3000
pnpm build                # Production build (standalone)
pnpm start                # Run production build
pnpm check                # Biome lint + format (run this before pushing)
pnpm test                 # Vitest run
pnpm coverage             # Vitest + coverage; gate at 95/95/95/95
pnpm e2e                  # Playwright (run pnpm e2e:install first locally)
pnpm lighthouse           # Lighthouse CI
```

## Conventions

- **Server components by default**; `'use client'` only when needed (event handlers, hooks, browser APIs).
- **Each component** has a co-located CSS Module + test file.
- **No ESLint/Prettier/Stylelint** — Biome 2 owns lint + format together.
- **No CSS frameworks** — CSS Modules + CSS custom properties.
- **Semi-transparent colors**: use `rgb(R G B / X%)` (modern). Never `rgba()`.
- **Animation library**: Motion. Don't add Framer Motion (Motion is the rebrand) or GSAP unless there's a specific reason.
- **Conventional Commits** enforced via commitlint pre-commit hook. Format: `<type>(<optional scope>): <subject>`.
- **Coverage**: 95% gate on lines/statements/branches/functions. New components MUST have tests.
- **`prefers-reduced-motion: reduce`** must be respected in any new interactive component.
- **3D / canvas / WebGL** components go in `vitest.config.ts` coverage excludes (happy-dom can't simulate them).

## Hot tips

- **TiltCard subtlety**: default `maxAngle: 4` → ±2° rotation. Don't crank it up — it was tuned down after user feedback that ±8° felt heavy.
- **MagneticButton refs**: use TWO narrow refs (`anchorRef`, `buttonRef`). Never use a single ref with `as` casts.
- **Motion `whileInView`**: use `viewport: { once: true, amount: 0.1 }`. Do NOT use `margin: '-X%'` — it was the cause of a "blank section" bug.
- **`.reveal` / `.stagger` CSS**: do not set `opacity: 0` on these classes in `globals.css`. They fight Motion's inline styles and hide content. Motion owns the animation entirely.
- **HeroScene**: must be lazy-loaded via `next/dynamic` with `ssr: false` to avoid Three.js bundle in initial JS payload.
- **Playwright test files** in `tests/e2e/` use `.e2e.ts` extension (not `.spec.ts`) so Vitest's default scan skips them.
- **Top-level await** is not supported in tsx/esbuild's CJS output for this project. Use `main().catch(...)` instead.
- **The `interests-refresh` workflow uses `GH_PAT`** for checkout so its `git push` triggers `build-deploy`. The default `GITHUB_TOKEN` doesn't trigger downstream workflows.

## Deployment

Push to `main` → GHA runs 6 parallel jobs (lint/typecheck/test/build/e2e/lighthouse) → docker job builds & pushes amd64 image with Trivy scan → deploy job updates `eks-helm-charts/fuhriman-chart/values.yaml` → ArgoCD syncs to k3s.

Secrets required: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GH_PAT`, and for the Interests refresh: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`, `STEAM_API_KEY`, `STEAM_ID_64`.

## Out of scope (don't suggest reverting unless asked)

- Switching back to ESLint (ecosystem block on ESLint 10 + typescript-eslint 8)
- Switching framework (Astro/Svelte/etc. — React stays for animation ecosystem)
- arm64 Docker builds (deferred — QEMU emulation took >12 min in CI)
- Reintroducing Dependabot (Renovate replaced it after the react/react-dom split-PR incident)
- Reintroducing the purple/charcoal glass-morphism theme (warm dark + amber is current)
