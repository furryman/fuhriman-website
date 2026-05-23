# CLAUDE.md

Guidance for Claude Code working in this repository.

The Next.js portfolio at **https://fuhriman.org**. Deploys via GitHub Actions → Docker Hub (multi-arch) → `furryman/eks-helm-charts` (CI bumps the image tag) → ArgoCD → k3s on AWS Graviton. See sibling repos at the end.

## Commands

This project uses **pnpm**, pinned via the `packageManager` field. Run `corepack enable` once locally so the pinned version is invoked automatically — do not use npm or yarn.

```bash
pnpm install              # First-time setup (use --frozen-lockfile in CI)
pnpm dev                  # Development server at localhost:3000
pnpm build                # Production build (standalone output)
pnpm start                # Start production server
pnpm lint                 # Biome lint
pnpm format               # Biome format --write
pnpm format:check         # Biome format check
pnpm check                # Biome check (lint + format together — CI gate)
pnpm test                 # Vitest run
pnpm coverage             # Vitest with coverage; 95/95/95/95 gate
pnpm e2e                  # Playwright smoke tests
pnpm e2e:install          # Install Playwright browsers (once per machine)
pnpm lighthouse           # Lighthouse CI against the standalone server
```

No `.env` file is needed — the app has zero application-side environment variables. The Spotify and Steam refresh scripts require env vars but only run in the `interests-refresh` GitHub Action; locally you can leave them unset.

Docker is a **multi-stage, multi-arch** build (Node 26 in the builder, distroless runtime, `linux/amd64` + `linux/arm64`):

```bash
# Local single-arch build for quick iteration
docker build -t furryman/fuhriman-website:dev .
docker run -p 3000:3000 furryman/fuhriman-website:dev

# Multi-arch reproduction of CI (rare; CI handles this on push)
docker buildx build --platform linux/amd64,linux/arm64 \
  -t furryman/fuhriman-website:dev --load .
```

The builder stage uses corepack to invoke pnpm with `pnpm install --frozen-lockfile`. The runtime stage is `gcr.io/distroless/nodejs26-debian13` and runs `node server.js` directly from the Next.js standalone output. The cluster node is ARM Graviton, so a single-arch amd64 build would not run in production.

## Architecture

Next.js 16 (App Router) + React 19 + TypeScript strict mode.

**Path alias**: `@/*` maps to `./src/*`.

**Pages**:

- `/` — Single-page portfolio. Section order: Hero → About → Philosophy → Skills → Experience → Projects → Interests → Resume CTA → Contact → Footer. In-page navigation uses anchor links.
- `/how-its-built` — Separate route at `src/app/how-its-built/page.tsx`, a technical deep-dive on the infrastructure. Inherits global styles, owns its own CSS module.

**Component pattern**: Pages in `src/app/` compose reusable components from `src/components/`. Each component is co-located with a CSS Module (`Foo.module.css`) and a test file (`Foo.test.tsx`). Server components by default; add `'use client'` only when the component needs a hook, event handler, or browser API.

**Styling**: CSS Modules + CSS custom properties defined in `globals.css`. No Tailwind, no CSS-in-JS. Global utility classes: `.container` (max-width 1100px), `.btn`, `.gradient-text`.

**Typography**: DM Serif Display (headings, weight 400 only — Google Fonts ships nothing else) + Source Sans 3 (body), loaded via `next/font/google` in `layout.tsx` and exposed as `--font-heading` / `--font-body`.

### Design system — Warm Dark + Amber

All design values live as CSS custom properties on `:root` in `src/app/globals.css`. Four categories:

**Color**:

```css
--background:        #1a1818;
--background-light:  #221e1c;
--background-card:   #1f1b19;
--text:              #f8f4ed;
--text-bright:       #ffffff;
--text-secondary:    #b8a890;
--text-faint:        #9a8d7a;
--accent:            #f0a868;     /* amber */
--accent-light:      #ffd9a8;
--accent-deep:       #c97c3d;
--accent-muted:      rgb(240 168 104 / 10%);
--accent-hover:      rgb(240 168 104 / 18%);
--rust:              #c93838;     /* sparing — emphasis only */
--border:            rgb(240 168 104 / 15%);
--border-hover:      rgb(240 168 104 / 45%);
--gradient-text:     linear-gradient(135deg, #f0a868 0%, #ffd9a8 50%, #c93838 100%);
```

**Translucent surfaces** (warm-dark glass for cards, panels, overlays):

```css
--surface-card:             rgb(26 22 21 / 60%);
--surface-card-hover:       rgb(34 28 25 / 70%);
--surface-card-soft:        rgb(26 22 21 / 50%);
--surface-card-soft-hover:  rgb(34 28 25 / 65%);
--surface-nav:              rgb(26 22 21 / 55%);
--surface-nav-scrolled:     rgb(20 16 14 / 80%);
--surface-overlay:          rgb(10 8 8 / 60%);
```

**Spacing** (4px baseline scale):

```css
--space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
--space-5: 1.25rem; --space-6: 1.5rem; --space-7: 1.75rem; --space-8: 2rem;
--space-10: 2.5rem; --space-12: 3rem; --space-16: 4rem; --space-20: 5rem; --space-24: 6rem;
--space-section-y:       var(--space-24);
--space-section-y-tight: var(--space-16);
```

**Type scale** (card titles unify on `--font-size-xl`; hero h1 and tagline use fluid clamps):

```css
--font-size-xs: 0.75rem; --font-size-sm: 0.875rem; --font-size-base: 1rem;
--font-size-md: 1.05rem; --font-size-lg: 1.1rem; --font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem; --font-size-3xl: 2rem;
--font-size-h1:      clamp(2.25rem, 5vw,   3.75rem);
--font-size-tagline: clamp(1.75rem, 4.5vw, 3.25rem);
```

All semi-transparent values use the modern space-separated `rgb(R G B / X%)` form. Never `rgba()`.

### Component highlights

**Ambient background** (`AmbientBackground.tsx`): fixed-position layer mounted once in `layout.tsx`. Two visual layers compose together:

1. Mesh gradient — three blurred amber/rust radial-gradient blobs drifting on 18–28s CSS `@keyframes` loops.
2. Constellation network — ~25 canvas-drawn particles with connection lines (drawn when pairwise distance < 100px) and gentle cursor pull (within 120px). Particles re-seed on resize, RAF pauses on `visibilitychange`.

Respects `prefers-reduced-motion: reduce` in both layers.

**Hero** (`Hero.tsx`): the 3D K8s cluster and the professional headshot are layered on desktop (≥1024px). The headshot is centered front-and-center (240px circle) on a z-index above the 3D scene; the cluster fills the 400×400 visual area behind it at `opacity: 0.75`. At 768–1023px the headshot shows alone (280px circle, no 3D). Below 768px neither is shown — text widens.

**Navbar** (`Navbar.tsx`): floating centered pill (`border-radius: 9999px`), always visible. Active section highlighting via Intersection Observer. Numbered links 01–07 (About → Contact), plus the "How I Built This" link, the ⌘K trigger button, and a pill-shaped Resume button. **Below 480px** the link list collapses behind a hamburger toggle that opens a slide-down panel; the panel handles Escape, outside-click, body-scroll-lock, and focus-return as a single `useEffect` gated on the open state.

**TiltCard** (`TiltCard.tsx`): subtle 3D tilt wrapper used by Skill, Experience, and Project cards. Default `maxAngle` is 4 (final rotation ±2°). 0.3s ease-out transition. `willChange: 'transform'` is toggled on `mouseenter`/`mouseleave` rather than set permanently.

**MagneticButton** (`MagneticButton.tsx`): polymorphic anchor-or-button. Renders `<a>` when `href` is provided, `<button>` otherwise. Two narrow refs (`anchorRef`/`buttonRef`) — do not use a single ref with type casts. Translates on mousemove up to ±12px, returns to rest on `mouseleave`.

**Command palette** (`CommandPalette.tsx`): triggers on ⌘K / Ctrl+K, also accessible via the kbd-styled button in the Navbar. Two groups: "Jump to" (all 7 sections) and "Actions" (Resume PDF, How It's Built, Copy email, GitHub, LinkedIn).

**CollapsibleCode** (`CollapsibleCode.tsx`): wraps long code blocks with a collapsed-by-default view, a fade gradient at the cutoff, and a "Show full snippet" toggle. Used on `/how-its-built` for the GitHub Actions yaml and other snippets. Per-instance `collapsedHeight` prop (default `16em`) drives the cutoff via a `--collapsed-height` CSS custom property; the `max-height` transition gives a smooth expand/collapse.

**ScrollReveal** (`ScrollReveal.tsx`): client wrapper using `motion`. Adds `reveal` (and optionally `stagger`) class on a `<motion.div>` and animates opacity/y on viewport entry via `whileInView` with `viewport: { once: true, amount: 0.1 }`.

**Icons** (`Icons.tsx`): all SVGs are decorative and carry `aria-hidden="true"`. Brand icons (AWS, Kubernetes, Terraform, GitHub Actions, Prometheus, Code) and social icons (GitHub, LinkedIn, Email).

**Numbered section headings**: CSS counters scoped to `main.portfolio section[id] h2` — sections without an `id` don't get numbered.

**View Transitions**: `view-transition-name: page-title` on the hero `<h1>` and the matching `<h1>` on `/how-its-built`. The browser handles the morph during route navigation (Chromium-only; Firefox/Safari fall back to instant nav). Custom `::view-transition-old/new(root)` and `::view-transition-old/new(page-title)` keyframes in `globals.css` give a 300ms cross-fade.

**Data in components**: Skills, Experience, Projects, Principles data are arrays at the top of each component file and mapped for rendering. Interests data comes from `public/spotify-top.json` and `public/steam-recent.json`, imported at module load.

**Static assets**: `public/headshot.jpg`, `public/resume.pdf`, `public/favicon.svg` (AF initials in Warm Dark + Amber), plus the two interests JSONs.

**Standalone output**: `next.config.js` sets `output: 'standalone'`. Production build produces `.next/standalone/server.js`. The Docker `CMD` runs `node server.js` directly, not `next start`.

### Animation libraries

- **`motion`** — used by `ScrollReveal`. Do not pair the reveal classes with CSS that sets `opacity: 0`; that fights Motion's inline styles and hides content.
- **`three` + `@react-three/fiber`** — used only in `HeroScene.tsx` (the 3D K8s cluster). Lazy-loaded via `next/dynamic` with `ssr: false`. Coverage-excluded in `vitest.config.ts` because WebGL isn't testable under happy-dom.
- **`cmdk`** — command palette. Custom CSS Module styles use `:global([cmdk-item])` selectors because cmdk relies on data attributes for theming and CSS Modules require explicit `:global()` for non-class selectors.

## Testing

Unit tests: **Vitest 4** + **React Testing Library** + **happy-dom**. Tests are colocated as `*.test.tsx` / `*.test.ts` (no separate `__tests__/` directory).

- `pnpm test` — single run.
- `pnpm coverage` — v8 coverage; enforces the 95/95/95/95 gate (lines/statements/branches/functions).
- Coverage exclusions live in `vitest.config.ts` with rationale comments: `next.config.js`, `next-env.d.ts`, `src/app/layout.tsx`, `src/components/AmbientBackground.tsx` (canvas — not testable in happy-dom), `src/components/HeroScene.tsx` (WebGL — same reason), `.next/**`, `**/*.d.ts`.

**Playwright** smoke tests live under `tests/e2e/`. Filenames must end in `.e2e.ts` so Vitest's default pattern skips them. They cover the golden path for `/` and `/how-its-built` against the built standalone. Run `pnpm e2e:install` once per machine.

**Lighthouse CI** via `pnpm lighthouse` against the standalone server. Budgets: Performance ≥ 90, Accessibility ≥ 0.95, Best Practices ≥ 95, SEO ≥ 95. INP assertion is `off` (cannot be measured in synthetic runs).

**Mocks in `vitest.setup.ts`**:

- `IntersectionObserver` polyfill (Navbar uses it directly).
- `next/image` mocked to render plain `<img>` and strip Next-specific props.
- `next/font/google` mocked to return `{ variable: '', className: '' }`.

## Linting and Formatting

**Biome 2** is the single source of truth for both lint and format. Config lives in `biome.json`.

- Rules: recommended set with `useUniqueElementIds` off (single-page nav uses literal IDs like `#about`).
- Per-file overrides: relax `noNonNullAssertion` in test files; relax `noTemplateCurlyInString` in `src/app/how-its-built/page.tsx` (the page contains literal `${var}` strings in displayed code samples).
- A husky pre-commit hook runs `biome check --write` on staged files via lint-staged. Don't bypass with `--no-verify` unless the user explicitly asks.

## Commit Conventions

Conventional Commits, enforced via a husky `commit-msg` hook backed by `commitlint` (`commitlint.config.cjs`).

Format: `<type>(<optional scope>): <subject>`. Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `build`, `perf`, `style`.

Examples: `feat(navbar): add command palette trigger`, `chore(deps): bump motion to 12.39.0`, `perf(AmbientBackground): re-seed on resize`. Non-conforming messages are rejected at commit time.

## Deployment

Push to `main` triggers `.github/workflows/build-deploy.yaml`. Six jobs run in parallel: `lint`, `typecheck`, `test` (with coverage upload), `build`, `e2e`, `lighthouse`. After all six pass, a `docker` job:

1. Sets up QEMU + buildx (`docker/setup-qemu-action` + `docker/setup-buildx-action`).
2. Builds **multi-arch** (`linux/amd64,linux/arm64`) and pushes to Docker Hub with tags `ga-YYYY.MM.DD-HHMM` and `latest`.
3. Runs Trivy v0.69.3 scan (severity HIGH/CRITICAL, `--ignore-unfixed`).

A final sequential `deploy` job:

1. Clones `furryman/eks-helm-charts`.
2. Bumps the image tag in `fuhriman-chart/values.yaml` via `yq`.
3. Commits + pushes. ArgoCD picks up the change on next reconciliation and rolls the deployment on the k3s cluster.

ARM matters here: the production cluster runs on a Graviton (`t4g.medium`) node. Building amd64-only would deploy a working image to Docker Hub that can't run in production. **Don't disable arm64 in the buildx step.**

Required GitHub secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GH_PAT` (repo scope — used for the helm-chart push AND by the `interests-refresh` workflow's checkout so its data-refresh push triggers `build-deploy`).

Related repos: `furryman/terraform`, `furryman/eks-helm-charts`, `furryman/argocd-app-of-apps`.

## Spotify and Steam Integration

The Interests section ("Off the clock") reads two static JSON files: `public/spotify-top.json` and `public/steam-recent.json`. Both are committed to the repo and bundled into the build at compile time (imported in `Interests.tsx`).

**Refresh cadence**: `.github/workflows/interests-refresh.yaml` runs weekly (Mondays at 06:00 UTC) and on manual `workflow_dispatch`. It runs `scripts/refresh-spotify.ts` and `scripts/refresh-steam.ts`, each with `continue-on-error: true` so a failure on one side doesn't block the other.

**PAT requirement**: the refresh workflow's `actions/checkout` step uses `${{ secrets.GH_PAT }}` instead of `GITHUB_TOKEN`. Pushes made by `GITHUB_TOKEN` do NOT trigger downstream workflows (GitHub's loop-prevention safeguard), so the PAT is required for the JSON refresh to also trigger `build-deploy`.

**Required secrets for the refresh workflow**:

- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` (one-time OAuth — see `docs/spotify-setup.md`)
- `STEAM_API_KEY`, `STEAM_ID_64`
- `STEAM_BLOCKLIST_APPIDS` (optional, comma-separated appids to hide from the public list)

**Steam header images**: `refresh-steam.ts` fetches the canonical `header_image` URL from Steam's `IStoreService/AppDetails` endpoint per game (parallel `Promise.all`) because newer titles use content-hashed paths that can't be constructed from the appid alone. Falls back to the legacy `cdn.cloudflare.steamstatic.com` URL on storefront fetch errors so one flaky call doesn't poison the refresh.

**Spotify refresh-token helper**: `scripts/get-spotify-refresh-token.ts` automates the one-time OAuth code exchange. Run via `pnpm tsx scripts/get-spotify-refresh-token.ts --client-id=… --client-secret=… --code=…`.

**Top-level await note**: all three scripts wrap their async work in `main().catch(...)` rather than top-level `await` — tsx/esbuild defaults to CJS output for this project (no `"type": "module"` in package.json) and top-level await is unsupported in CJS.

## Dependency Management

Dependency updates are managed by **Renovate** (`renovate.json5`). Updates are grouped (e.g. `react` + `react-dom` together, `next-*` together, `@types/*`, `actions/*`, `docker/*`) and tiered: patch updates auto-merge on green CI; minor and major updates open a PR for review.

## When working in this codebase

**Defaults**:

- Reach for the smallest change that satisfies the request. Avoid speculative refactors.
- Every new component gets a co-located `*.test.tsx`. The 95/95/95/95 coverage gate is enforced — your PR will fail CI if it drops below the threshold on any of the four metrics.
- Use spacing tokens (`var(--space-*)`) and type tokens (`var(--font-size-*)`) instead of magic numbers when adding new CSS. New translucent surfaces use one of the `--surface-*` tokens.
- Use Motion for animation, not raw CSS transitions, unless the animation is purely declarative and trivial (hover transitions, etc.).
- Use the modern `rgb(R G B / X%)` form for semi-transparent colors. Never `rgba()`.
- Respect `prefers-reduced-motion: reduce` in any new interactive component.
- Server components by default. Add `'use client'` only when you need a hook, event handler, or browser-only API.

**Gotchas**:

- Don't set `opacity: 0` on `.reveal` / `.stagger` / their children — Motion sets inline opacity and CSS rules will fight it.
- Don't use `as React.RefObject<HTMLAnchorElement>` or `as any` casts on JSX refs. If you need to support multiple element types, declare separate narrow refs (see `MagneticButton`).
- The 3D hero (`HeroScene.tsx`) uses `<primitive object={...} />` for line geometry because R3F v9 renames `<line>` to `<threeLine>` to avoid SVG conflicts.
- Test files importing `@playwright/test` must be named `*.e2e.ts` (not `*.spec.ts`) so Vitest's default pattern skips them.
- The image tag in `eks-helm-charts/fuhriman-chart/values.yaml` is written by **this repo's** CI. Don't hand-edit it from the helm-charts side; that change will be overwritten on the next push here.
- Docker builds in CI are multi-arch via QEMU. Locally `docker build` produces only your host arch — fine for iteration but the cluster expects arm64.

## Reference

- `docs/spotify-setup.md` — one-time Spotify OAuth setup + Steam API key requirements.
- `AGENT.md` — short "framework-agnostic" guide intended for other AI coding tools (Codex, Cursor, Aider). The deep version is this file.
