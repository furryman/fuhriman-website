# CLAUDE.md

Guidance for Claude Code working in this repository.

## Build and Development Commands

This project uses **pnpm** (pinned via the `packageManager` field in `package.json`). Run `corepack enable` once locally so the pinned pnpm version is invoked automatically — do not use npm or yarn.

```bash
pnpm install              # First-time setup (use --frozen-lockfile in CI)
pnpm dev                  # Start development server at localhost:3000
pnpm build                # Production build (standalone output)
pnpm start                # Start production server
pnpm lint                 # Biome lint
pnpm format               # Biome format --write
pnpm format:check         # Biome format check
pnpm check                # Biome check (lint + format together, CI gate)
pnpm test                 # Vitest run (unit tests)
pnpm coverage             # Vitest with coverage; gate at 95/95/95/95
pnpm e2e                  # Playwright smoke tests
pnpm e2e:install          # Install Playwright browsers (one-time per machine)
pnpm lighthouse           # Lighthouse CI against the built standalone server
```

No `.env` file is needed — the app has zero application-side environment variables. The Spotify + Steam refresh scripts require env vars but only run in the `interests-refresh` GitHub Action; locally you can leave them unset.

Docker (multi-stage build, Node 26 in the builder, **distroless** in the final stage, amd64-only):

```bash
docker build -t furryman/fuhriman-website:latest .
docker run -p 3000:3000 furryman/fuhriman-website:latest
```

The builder stage uses corepack to invoke the pinned pnpm version with `pnpm install --frozen-lockfile`. The runtime stage is `gcr.io/distroless/nodejs26-debian13` and runs `node server.js` directly from the Next.js standalone output.

## Architecture

Next.js 16.2.6 portfolio site using the App Router with React 19 and TypeScript strict mode.

**Path alias**: `@/*` maps to `./src/*`

**Pages**:

- `/` — Single-page portfolio. Section order: Hero → About → Philosophy → Skills → Experience → Projects → Interests → Resume CTA → Contact → Footer. Navigation uses anchor links (`#about`, `#philosophy`, `#skills`, `#experience`, `#projects`, `#interests`, `#contact`).
- `/how-its-built` — Separate route (`src/app/how-its-built/page.tsx`), titled "How I Built This", a technical deep-dive on the infrastructure. Inherits global styles but has its own CSS module.

**Component pattern**: Pages in `src/app/` compose reusable components from `src/components/`. Each component has a co-located CSS Module file (e.g., `Hero.tsx` + `Hero.module.css`) and a `*.test.tsx` test file. Server components by default; `'use client'` only where interactivity requires it (Navbar, ScrollReveal, AmbientBackground, CommandPalette, TiltCard, MagneticButton, HeroScene).

**Styling**: CSS Modules with CSS variables defined in `globals.css`. No Tailwind or CSS framework. Global utility classes: `.container` (max-width 1100px), `.btn`, `.gradient-text`.

**Typography**: DM Serif Display (headings, weight 400 only) + Source Sans 3 (body), loaded via `next/font/google` in `layout.tsx` and exposed as `--font-heading` / `--font-body` CSS variables.

**Design system — Warm Dark + Amber**:

```css
--background:        #1a1818;
--background-light:  #221e1c;
--background-card:   #1f1b19;
--text:              #f8f4ed;
--text-bright:       #ffffff;
--text-secondary:    #b8a890;
--text-faint:        #7a6f5e;
--accent:            #f0a868;     /* amber */
--accent-light:      #ffd9a8;
--accent-deep:       #c97c3d;
--accent-muted:      rgb(240 168 104 / 10%);
--rust:              #c93838;     /* sparing — emphasis only */
--border:            rgb(240 168 104 / 15%);
--border-hover:      rgb(240 168 104 / 45%);
--gradient-text:     linear-gradient(135deg, #f0a868 0%, #ffd9a8 50%, #c93838 100%);
```

All semi-transparent values use the modern space-separated `rgb(R G B / X%)` form, not legacy `rgba(R, G, B, A)`.

**Ambient background** (`src/components/AmbientBackground.tsx`): fixed-position layer mounted once in `layout.tsx`. Two visual layers compose together:

1. **Mesh gradient** — three blurred amber/rust radial-gradient blobs drifting on 18–28s CSS `@keyframes` loops.
2. **Constellation network** — ~25 canvas-drawn particles with connection lines (drawn when pairwise distance < 100px) and gentle cursor pull (within 120px). Particles re-seed on resize, RAF pauses on `visibilitychange`. Respects `prefers-reduced-motion: reduce`.

**Animation libraries**:

- **`motion`** (Vercel's, formerly Framer Motion) — `ScrollReveal` uses `whileInView` with `viewport: { once: true, amount: 0.1 }`; do NOT use `margin: '-X%'` (it's too restrictive and was a previous bug).
- **`three` + `@react-three/fiber`** — used only in `HeroScene.tsx` (the 3D K8s cluster). Lazy-loaded via `next/dynamic` with `ssr: false`. Coverage-excluded in `vitest.config.ts` because WebGL isn't testable under happy-dom.
- **`cmdk`** — command palette. Custom CSS Module styles use `:global([cmdk-item])` selectors because cmdk relies on data attributes for theming and CSS Modules require explicit `:global()` for non-class selectors.

**Hero** (`src/components/Hero.tsx`): the 3D K8s cluster and the professional headshot are LAYERED on desktop (≥1024px). The headshot is centered front-and-center (240px circle) on a z-index above the 3D scene; the cluster fills the 400×400 visual area behind it at `opacity: 0.75`. At 768–1023px the headshot shows alone (280px circle, no 3D). Below 768px neither is shown — text widens.

**TiltCard** (`src/components/TiltCard.tsx`): subtle 3D tilt wrapper used by Skill, Experience, and Project cards. Default `maxAngle` is 4 (final rotation ±2°). 0.3s ease-out transition. `willChange: 'transform'` is toggled on `mouseenter`/`mouseleave` rather than set permanently. Respects `prefers-reduced-motion`.

**MagneticButton** (`src/components/MagneticButton.tsx`): polymorphic anchor-or-button. Renders `<a>` when `href` is provided, `<button>` otherwise. Two narrow refs (`anchorRef`/`buttonRef`) — never use a single ref with type casts. Translates on mousemove up to ±12px, returns to rest on `mouseleave`. Respects `prefers-reduced-motion` in both move AND leave handlers.

**Command palette** (`src/components/CommandPalette.tsx`): triggers on ⌘K / Ctrl+K, also accessible via the kbd-styled button in the Navbar. Two groups: "Jump to" (sections) and "Actions" (Resume PDF, How It's Built, Copy email, GitHub, LinkedIn).

**Scroll reveals**: `ScrollReveal.tsx` is a `'use client'` Motion wrapper. Adds `reveal` (and optionally `stagger`) class on a `<motion.div>` and animates opacity/y on viewport entry. Do NOT add CSS rules that set `opacity: 0` on `.reveal`/`.stagger`/their children — those legacy rules used to fight Motion's inline styles and hide content.

**Hover micro-interactions** (in `globals.css`): content links inside `main` get an underline-grow effect via `::after`. Skill tags glow amber on hover.

**View Transitions**: declared via `view-transition-name: page-title` on the hero `<h1>` (`Hero.module.css`) and the matching `<h1>` on `/how-its-built` (`page.module.css`). The browser handles the morph during route navigation (Chromium-only; Firefox/Safari fall back to instant nav). Custom `::view-transition-old/new(root)` and `::view-transition-old/new(page-title)` keyframes in `globals.css` give a 300ms cross-fade.

**Icons**: `src/components/Icons.tsx` — all SVGs are decorative and carry `aria-hidden="true"`. Brand icons (AWS, Kubernetes, Terraform, GitHub Actions, Prometheus, Code) and social icons (GitHub, LinkedIn, Email).

**Navbar**: floating centered pill (`border-radius: 9999px`), always visible. Active section highlighting via Intersection Observer. Numbered links 01–07 (About → Contact). Plus: "How I Built This" link, ⌘K trigger button, and the pill-shaped Resume button.

**Numbered section headings**: CSS counters scoped to `main.portfolio section[id] h2` — sections without an `id` don't get numbered.

**Data in components**: Skills, Experience, Projects, Principles data are arrays at the top of each component file and mapped for rendering. Interests data comes from `public/spotify-top.json` and `public/steam-recent.json` imported at module load.

**Static assets**: `public/headshot.jpg`, `public/resume.pdf`, `public/favicon.svg` (AF initials), plus the two interests JSONs.

**Standalone output**: `next.config.js` sets `output: 'standalone'`. Production build produces `.next/standalone/server.js`. The Docker `CMD` runs `node server.js` directly, not `next start`.

## Testing

Unit tests: **Vitest 4.x** + **React Testing Library** + **happy-dom**. Tests are colocated as `*.test.tsx` / `*.test.ts` (no separate `__tests__/` directory).

- `pnpm test` — single run
- `pnpm coverage` — runs with the v8 coverage provider; enforces the 95/95/95/95 gate (lines/statements/branches/functions)
- Coverage exclusions live in `vitest.config.ts` with rationale comments. Current excludes: `next.config.js`, `next-env.d.ts`, `src/app/layout.tsx`, `src/components/AmbientBackground.tsx` (canvas — not testable in happy-dom), `src/components/HeroScene.tsx` (WebGL — same reason), `.next/**`, `**/*.d.ts`.

**Playwright** smoke tests live under `tests/e2e/` (filename suffix `.e2e.ts` — Vitest skips this pattern). Cover the golden path for `/` and `/how-its-built` against the built standalone. Run `pnpm e2e:install` once locally to fetch browser binaries.

**Lighthouse CI** is wired via `pnpm lighthouse` against the standalone server. Budgets: Performance ≥ 90, Accessibility ≥ 0.98 (lowered from 1.00 — `/how-its-built` has a heading-order issue; raise once fixed), Best Practices ≥ 95, SEO ≥ 95. INP assertion is `off` (cannot be measured in synthetic runs).

**Mocks set up in `vitest.setup.ts`**:
- `IntersectionObserver` polyfill (Navbar still uses it directly; ScrollReveal does NOT depend on the polyfill — it's Motion-based now).
- `next/image` mocked to render plain `<img>` and strip Next-specific props.
- `next/font/google` mocked to return `{ variable: '', className: '' }`.

## Linting and Formatting

**Biome 2** is the single source of truth for both lint and format (replaces ESLint + Prettier + Stylelint). Config lives in `biome.json`.

- Rules: recommended set with `useUniqueElementIds` off (single-page nav uses literal IDs like `#about`).
- Per-file overrides relax `noNonNullAssertion` in test files and `noTemplateCurlyInString` in `src/app/how-its-built/page.tsx` (page contains literal `${var}` strings in displayed code samples).
- Run `pnpm lint` for lint-only, `pnpm format` to format, `pnpm format:check` to verify, or `pnpm check` for combined lint+format (this is what CI runs).
- A **pre-commit hook** (husky + lint-staged) runs `biome check --write` on staged files. Don't bypass with `--no-verify`.

**Why Biome over ESLint**: ESLint 10 is currently unusable on this stack because `typescript-eslint@8` (latest stable, transitive via `eslint-config-next`) calls `scopeManager.addGlobals()` which ESLint 10 removed. `typescript-eslint@9` has not shipped. Biome bypasses the entire typescript-eslint chain.

## Commit Conventions

Conventional Commits, enforced via a husky `commit-msg` hook backed by `commitlint` (`commitlint.config.cjs`).

Format: `<type>(<optional scope>): <subject>`. Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `build`, `perf`, `style`.

Examples: `feat(navbar): add command palette trigger`, `chore(deps): bump motion to 12.39.0`, `perf(AmbientBackground): re-seed on resize`. Non-conforming messages are rejected at commit time.

## Deployment

Push to `main` triggers GitHub Actions, which runs the following jobs in parallel: `lint`, `typecheck`, `test` (with coverage upload), `build`, `e2e`, `lighthouse`. After all six pass, a `docker` job builds the amd64 image (Trivy v0.69.3 scan, severity HIGH/CRITICAL, ignore-unfixed) and pushes to Docker Hub with tags `ga-YYYY.MM.DD-HHMM` and `latest`. A final sequential `deploy` job:

1. Updates `eks-helm-charts/fuhriman-chart/values.yaml` with the new image tag (using `yq`)
2. ArgoCD then syncs the change to the k3s cluster

Required GitHub secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GH_PAT` (repo scope — used for the helm-chart push AND by `interests-refresh.yaml`'s checkout so its data-refresh push triggers `build-deploy`).

Related repos: `furryman/terraform`, `furryman/eks-helm-charts`, `furryman/argocd-app-of-apps`

## Spotify + Steam Integration

The Interests section ("Off the clock") reads two static JSON files: `public/spotify-top.json` and `public/steam-recent.json`. Both are committed to the repo and bundled into the build at compile time (imported in `Interests.tsx`).

**Refresh cadence**: The `.github/workflows/interests-refresh.yaml` workflow runs weekly (Mondays at 06:00 UTC) and on manual `workflow_dispatch`. It runs `scripts/refresh-spotify.ts` and `scripts/refresh-steam.ts`, each with `continue-on-error: true` so a failure on one side doesn't block the other.

**Crucial**: the refresh workflow's `actions/checkout` step uses `${{ secrets.GH_PAT }}`. This is what allows its `git push` to trigger the `build-deploy` workflow. The default `GITHUB_TOKEN` pushes do NOT trigger downstream workflows (GitHub's loop-prevention safeguard). If you remove the PAT, the JSON updates will commit but the site won't redeploy.

**Required secrets for the refresh workflow**:
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` (one-time OAuth — see `docs/spotify-setup.md`)
- `STEAM_API_KEY`, `STEAM_ID_64`

**Spotify refresh-token helper**: `scripts/get-spotify-refresh-token.ts` automates the one-time OAuth code exchange. Run via `pnpm tsx scripts/get-spotify-refresh-token.ts --client-id=… --client-secret=… --code=…`.

**Top-level await note**: all three scripts wrap their async work in `main().catch(...)` rather than top-level `await` — tsx/esbuild defaults to CJS output for this project (no `"type": "module"` in package.json) and top-level await is unsupported in CJS.

## Dependency Management

Dependency updates are managed by **Renovate** (`renovate.json5`), not Dependabot. Updates are grouped (e.g. `react`+`react-dom` together, `next-*` together, `@types/*`, `actions/*`, `docker/*`) and tiered: patch updates auto-merge on green CI; minor and major updates open a PR for review. See `docs/modernization-notes.md` for the rationale (a Dependabot incident split `react` and `react-dom` into separate PRs and broke CI).

## When working in this codebase

**Defaults**:
- Reach for the smallest possible change that satisfies the request. Avoid speculative refactors.
- Every new component gets a co-located `*.test.tsx` file. Coverage gate is enforced — your PR will fail CI if it drops below 95% on any of the four metrics.
- Use Motion for animation, not raw CSS transitions, unless the animation is purely declarative and trivial (hover transitions, etc.).
- Use the modern `rgb(R G B / X%)` form for semi-transparent colors. Never `rgba()`.
- Respect `prefers-reduced-motion: reduce` in any new interactive component.
- Server components by default. Add `'use client'` only when you need a hook, event handler, or browser-only API.

**Gotchas**:
- Don't reintroduce `.reveal { opacity: 0 }` or `.stagger > * { opacity: 0 }` to globals.css — they fight Motion's inline styles and hide content.
- Don't use `as React.RefObject<HTMLAnchorElement>` or `as any` casts on JSX refs. If you need to support multiple element types, declare separate narrow refs.
- The `interests-refresh` workflow's PAT requirement is non-obvious; the comment in the YAML explains why.
- The 3D hero (`HeroScene.tsx`) uses `<primitive object={...} />` for line geometry because R3F v9 renames `<line>` to `<threeLine>` to avoid SVG conflicts.
- Test files importing `@playwright/test` MUST be named `*.e2e.ts` (not `*.spec.ts`) so Vitest's default pattern skips them.

## Reference docs

- `docs/spotify-setup.md` — one-time Spotify OAuth setup + Steam API key requirements.
- `docs/modernization-notes.md` — narrative changelog of the May 2026 modernization (Next 16, Biome 2, etc.) and the Dependabot incident that motivated Renovate.
- `docs/superpowers/specs/2026-05-19-modernization-design.md` — design spec for the modernization (uncommitted local reference).
- `docs/superpowers/specs/2026-05-20-redesign-design.md` — design spec for this redesign (uncommitted local reference).
- `docs/superpowers/plans/2026-05-20-redesign.md` — 65KB step-by-step implementation plan with phase-by-phase task code (uncommitted local reference).
</content>
</invoke>