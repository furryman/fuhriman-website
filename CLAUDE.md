# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

This project uses **pnpm** (pinned via the `packageManager` field in `package.json`). Use `corepack enable` once locally so the pinned pnpm version is invoked automatically — do not use npm or yarn.

```bash
pnpm install              # First-time setup (use --frozen-lockfile in CI)
pnpm dev                  # Start development server at localhost:3000
pnpm build                # Production build (standalone output)
pnpm start                # Start production server
pnpm lint                 # ESLint 9 flat config (eslint .)
pnpm stylelint            # Stylelint over CSS modules
pnpm format               # Prettier — write
pnpm format:check         # Prettier — check only (CI gate)
pnpm test                 # Vitest run (unit tests)
pnpm coverage             # Vitest with coverage; gate at 95/95/95/95
pnpm e2e                  # Playwright smoke tests
pnpm e2e:install          # Install Playwright browsers (one-time per machine)
pnpm lighthouse           # Lighthouse CI against the built standalone server
```

No `.env` file is needed — the app has zero environment variables.

Docker (multi-stage build, Node 26 in the builder, **distroless** in the final stage, amd64-only):

```bash
docker build -t furryman/fuhriman-website:latest .
docker run -p 3000:3000 furryman/fuhriman-website:latest
```

The builder stage uses corepack to invoke the pinned pnpm version with `pnpm install --frozen-lockfile`. The runtime stage is `gcr.io/distroless/nodejs26-debian12` and runs `node server.js` directly from the Next.js standalone output.

## Architecture

This is a Next.js 16.2.6 portfolio website using the App Router with React 19 and TypeScript strict mode.

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

The visual design is locked. Modernization workstreams explicitly exclude redesign work — see `docs/modernization-notes.md`.

**Animations**: CSS-only scroll reveal system. `ScrollReveal.tsx` is a `'use client'` wrapper using Intersection Observer that adds a `visible` class. Supports staggered children via the `.stagger` class. No animation dependencies.

**Numbered section headings**: CSS counters scoped to `main.portfolio section[id] h2` — sections without an `id` (like Resume CTA) don't get numbered.

**Icons**: `src/components/Icons.tsx` contains all SVG icon components — brand icons (AWS, Kubernetes, Terraform, GitHub Actions, Prometheus, Code) and social icons (GitHub, LinkedIn, Email). No icon library dependencies.

**Navbar**: `src/components/Navbar.tsx` is a `'use client'` component — floating centered pill (`border-radius: 9999px`) with glass background, always pinned to top (no hide-on-scroll). Active section highlighting via Intersection Observer. Numbered links (01–05), "How I Built This" link, and pill-shaped Resume button.

**Data in components**: Skills, experience, and other content data are defined as arrays/objects at the top of component files, then mapped for rendering.

**Static assets**: `public/headshot.jpg` (used via `next/image` with priority, opacity 0.9, hidden below 768px), `public/resume.pdf` (linked from navbar and Resume CTA section), and `public/favicon.svg` (AF initials in purple on dark background). Use `next/image` for any new images, not `<img>`.

**Standalone output**: `next.config.js` sets `output: 'standalone'`, so the production build produces `.next/standalone/server.js`. The Docker CMD runs `node server.js` directly, not `next start`.

## Testing

The unit-test stack is **Vitest 3.x** + **React Testing Library** + **happy-dom**. Tests live next to source files as `*.test.tsx` / `*.test.ts` (colocated, not in a separate `__tests__` directory).

- `pnpm test` — single run
- `pnpm coverage` — runs with the v8 coverage provider and enforces the 95/95/95/95 gate (lines/statements/branches/functions)
- Coverage exclusions are documented in `vitest.config.ts` and currently cover: `next.config.js`, `eslint.config.mjs`, `next-env.d.ts`, `src/app/layout.tsx`, `.next/**`, and `**/*.d.ts`. Add new exclusions sparingly and with a one-line justification.

**Playwright** smoke tests live under `e2e/` and cover the golden path for `/` and `/how-its-built` — they run against the built standalone server in CI. Run `pnpm e2e:install` once locally to fetch browser binaries.

**Lighthouse CI** is wired via `pnpm lighthouse` against the standalone server with budgets: Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95, LCP < 2.5s, CLS < 0.1, INP < 200ms.

## Linting and Formatting

- **ESLint 9** with flat config in `eslint.config.mjs`. Run via `pnpm lint` (`eslint .`). The legacy `.eslintrc.json` is preserved for tooling that still reads it; `eslint.config.mjs` is authoritative.
- **Stylelint** with `stylelint-config-standard` + `stylelint-config-css-modules` over `**/*.css` (CSS Modules). Run via `pnpm stylelint`.
- **Prettier** is configured in `.prettierrc.json` — `printWidth: 100`, `singleQuote: true`, `semi: false`, plus the trailing-comma defaults. Markdown is in `.prettierignore` (CLAUDE.md and other docs are not auto-formatted). Run `pnpm format` to write, `pnpm format:check` in CI.
- A **pre-commit hook** (husky + lint-staged) runs ESLint, Stylelint, and Prettier on staged files only. The hook must pass before the commit is created — do not bypass with `--no-verify`.

## Commit Conventions

This repo enforces **Conventional Commits** via a husky `commit-msg` hook backed by `commitlint` (`commitlint.config.cjs`).

Format: `<type>(<optional scope>): <subject>`. Common types in use:

- `feat:` — user-visible new functionality
- `fix:` — bug fixes
- `chore:` — tooling, deps, config, CI
- `docs:` — documentation only
- `refactor:` — code change with no behavior change
- `test:` — adding or improving tests
- `ci:` — CI pipeline changes
- `build:` — build system or external dependency changes

Examples: `feat(navbar): add active section indicator`, `chore(deps): bump next to 16.2.6`, `docs: refresh CLAUDE.md for pnpm + vitest`. Non-conforming messages are rejected at commit time.

## Deployment

Push to `main` triggers GitHub Actions, which runs the following jobs in parallel: `lint`, `typecheck`, `test` (with coverage upload), `build`, `e2e`, `lighthouse`, and `docker` (buildx + Trivy scan + push). After all jobs pass, a sequential `deploy` job:

1. Pushes the image to Docker Hub with tags `ga-YYYY.MM.DD-HHMM` and `latest` (amd64-only — arm64 deferred; QEMU emulation builds took >12 min in CI)
2. Updates `eks-helm-charts/fuhriman-chart/values.yaml` with the new image tag (using `yq`)
3. ArgoCD then syncs the change to the k3s cluster

Required GitHub secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `GH_PAT` (repo scope for updating `eks-helm-charts`).

Related repos: `furryman/terraform`, `furryman/eks-helm-charts`, `furryman/argocd-app-of-apps`

## Dependency Management

Dependency updates are managed by **Renovate** (`renovate.json`), not Dependabot. Updates are grouped (e.g. `react`+`react-dom` together, `next-*` together, `eslint-*` together, `@types/*`, `actions/*`, `docker/*`) and tiered: patch updates auto-merge on green CI; minor and major updates open a PR for review. See `docs/modernization-notes.md` for the rationale (a Dependabot incident split `react` and `react-dom` into separate PRs and broke CI).
