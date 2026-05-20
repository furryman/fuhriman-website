# Modernization Notes — May 2026

A narrative changelog for the May 2026 modernization of `fuhriman-website`. This document captures **what changed, why, and what was explicitly left alone**, so future readers (humans and Claude alike) don't have to reconstruct the rationale from commit history.

The full design spec lives at `docs/superpowers/specs/2026-05-19-modernization-design.md`. This file is the human-readable companion.

## What Changed and Why

The trigger was a broken CI push: a Dependabot bump of `aquasecurity/trivy-action` (v0.30.0 → v0.34.0) crashed on install, blocking the React 19 / Next 16 / ESLint 9 upgrade from shipping. Rather than patch the immediate failure and move on, the decision was made to harden the broader pipeline against future regressions of the same shape.

The modernization is bounded by one principle: **this is a low-risk static portfolio (no API, no DB, no auth) and the visual design is locked.** Effort goes into deterministic CI, real test coverage, and ergonomic dev tooling — not features, not redesign.

Headline outcomes:

- pnpm replaces npm. Faster, stricter, content-addressable.
- Vitest replaces a non-existent test framework. 95% coverage gate over a real surface.
- Playwright smoke tests for both routes.
- Lighthouse CI with budgets.
- Distroless Node 26 runtime, amd64-only (arm64 deferred — see "Multi-arch deferral" below).
- ESLint 9 flat config; Prettier; Stylelint; husky + lint-staged + commitlint.
- Renovate replaces Dependabot (grouped + tiered).
- Conventional commits enforced at commit-time.

## Stack: Before vs After

| Area | Before | After |
|---|---|---|
| Package manager | npm | pnpm (pinned via `packageManager`) |
| Node base image | Node 20 Alpine | Node 26 (builder) → `gcr.io/distroless/nodejs26-debian12` (runtime) |
| Next.js | 14.2.0 | 16.2.6 |
| React | 18 | 19 |
| ESLint | Next.js default (`next lint`) | ESLint 9 flat config (`eslint.config.mjs`) |
| Formatting | none enforced | Prettier (`printWidth: 100`, `singleQuote`, no semi) |
| CSS linting | none | Stylelint (`stylelint-config-standard` + `stylelint-config-css-modules`) |
| Unit tests | none | Vitest 3.x + React Testing Library + happy-dom, 95% coverage gate |
| E2E tests | none | Playwright smoke (`/` and `/how-its-built`) |
| Performance gate | none | Lighthouse CI with budgets |
| Dep updates | Dependabot | Renovate (grouped + tiered) |
| Commit conventions | none | Conventional Commits via husky `commit-msg` + commitlint |
| Docker build | single-arch amd64 | distroless final stage, digest-pinned, non-root (amd64-only — see "Multi-arch deferral") |
| CI structure | sequential | parallel jobs (lint, typecheck, test, build, e2e, lighthouse, docker) → sequential deploy |

## New Tooling Decisions and Rationale

### Vitest over Jest

Vitest was chosen as the unit-test framework for three reasons:

1. **ESM-native**. Next 16 / React 19 push the ecosystem further toward ESM, and Jest still requires meaningful configuration to handle ESM cleanly. Vitest is ESM-first by default.
2. **Shared toolchain with Vite-style transforms**. Vite-flavored projects get faster transforms and clearer error messages without a separate Babel/SWC pipeline for tests.
3. **First-class coverage via v8**. The v8 coverage provider is bundled and avoids the Babel-instrumentation overhead of istanbul. We use it directly for the 95% gate.

happy-dom is preferred over jsdom for speed; it's sufficient for everything this codebase tests (no `IntersectionObserver` regressions because the only consumer, `ScrollReveal`, is tested via mocking, not real DOM observation).

### Renovate over Dependabot

See the incident below for the immediate trigger. Beyond that, Renovate's grouping and tiering policy fits how a one-developer portfolio actually wants to handle updates: batch patch noise, surface real changes for review.

Config highlights:

- Groups: `react`+`react-dom`; `next-*`; `eslint-*`; `@types/*`; `actions/*`; `docker/*`
- Patch updates auto-merge on green CI
- Minor and major updates open a PR for human review
- Non-security updates run on a weekly schedule to avoid daily PR floods

### Distroless Final Stage

The runtime image is `gcr.io/distroless/nodejs26-debian12`. Reasons:

- **Smaller attack surface**: no shell, no package manager, no busybox utilities at runtime.
- **Smaller image**: meaningful reduction over Alpine + Node.
- **Multi-arch deferral**: distroless is published for both amd64 and arm64, but multi-arch CI builds via QEMU emulation took >12 min on `ubuntu-latest`. Reverted to amd64-only for CI throughput. To restore arm64, matrix the docker job across `ubuntu-latest` (amd64) and `ubuntu-24.04-arm` (native arm64), then merge manifests with `docker buildx imagetools create`.

The builder stage stays on a full Node 26 image so corepack + pnpm + Next's build pipeline have everything they need; only the final stage is distroless.

Rollback path: change the `FROM` line back to a Node 26 Alpine. Single-line revert.

### Trivy Pinning

`aquasecurity/trivy-action` is pinned to the last known-working version (v0.30.0) with `severity: HIGH,CRITICAL` and `ignore-unfixed: true`. Renovate will surface future Trivy bumps as PRs we can validate manually rather than silently rolling forward.

### pnpm

Switched from npm for:

- **Deterministic resolution**: stricter dependency graph, no phantom deps.
- **Content-addressable store**: faster installs across CI cache resets.
- **packageManager pinning**: corepack picks up the exact pnpm version from `package.json`, removing "works on my machine" variance.

pnpm 11.1.3 is the pinned version. `pnpm-workspace.yaml` carries `onlyBuiltDependencies` + `allowBuilds` entries for `sharp` and `unrs-resolver` because pnpm 11 no longer auto-runs install scripts and `--frozen-lockfile` would otherwise prompt in CI.

Bun was considered and rejected — it's still maturing on the Next.js ESM/build path and the gain over pnpm doesn't justify the risk on a deployed portfolio.

### ESLint 9 Flat Config

`eslint.config.mjs` is authoritative. The legacy `.eslintrc.json` is left in place because some tooling (editor plugins, certain CI integrations) still reads it; both files are kept consistent. When ESLint 9's flat config is universally supported by adjacent tools, the legacy file can be removed.

## The Dependabot Incident (Why Renovate)

The proximate cause for swapping dep tooling: Dependabot opened **two separate PRs** for what should have been one logical update.

`react` and `react-dom` had a minor bump available. Dependabot's default behavior is one-package-per-PR, so it opened:

- PR A: bump `react` 18.x → 19.x
- PR B: bump `react-dom` 18.x → 19.x

Either PR in isolation would break the build — React 19's `react-dom` requires React 19, and vice versa. The PRs merged out of order against `main`, with CI passing on the first because of cached node_modules and failing on the second after a clean install. The resulting `main` was red until both were rebased and merged together.

Renovate's grouped policy puts `react` + `react-dom` in a single PR (and applies the same logic to `next-*`, `eslint-*`, `@types/*`, `actions/*`, `docker/*`). The class of failure goes away.

This is also why the **patch auto-merge** tier is acceptable: patch-level updates within a Renovate group can't interleave the way the React incident did.

## 95% Coverage Policy

The coverage gate is **95% on lines, statements, branches, and functions** — enforced by `pnpm coverage` via Vitest's v8 provider. The threshold sits 5 points below 100% on purpose: the headroom exists for genuinely-untestable edges, not as license for skipped tests.

### Exclusions

Documented in `vitest.config.ts`:

| Path | Why excluded |
|---|---|
| `next.config.js` | Build-time config, not application code |
| `eslint.config.mjs` | Lint config, not application code |
| `next-env.d.ts` | Generated by Next; ambient type declarations only |
| `src/app/layout.tsx` | Root layout — primarily metadata and font loading; effectively integration-tested by Playwright route load |
| `.next/**` | Build output |
| `**/*.d.ts` | Type-only declarations |

New exclusions require a one-line justification in `vitest.config.ts` (and ideally a brief mention in this file's next revision). The intent is to keep the excluded surface small, named, and reviewable — not to grow a junk drawer.

### What "real surface" means

A 100% gate on a small codebase invites theatrical tests for impossible branches (the proverbial `if (x === undefined && x !== undefined)` test). 95% over the real, exercised surface is more honest than 100% padded with no-op tests, and it leaves a visible gap when something genuinely useful is untested.

## Explicitly Out of Scope

The following were considered and deliberately left untouched. If a future request seems to drift into these areas, push back or confirm first:

- **Visual / UI redesign** — the purple glass-morphism design is locked. Color tokens, typography, layout, and the floating pill navbar do not change as part of modernization.
- **Application feature work** — no new sections, no new pages, no content rewrites.
- **`/how-its-built` content** — modernization may touch the file for testing/coverage, but the prose stays as-is.
- **Switching package manager to bun** — pnpm is the chosen target; bun is not.
- **Removing the legacy `.eslintrc.json`** — kept alongside the flat config until adjacent tooling catches up.
- **`next.config.js` and `tsconfig.json`** — treated as DO-NOT-TOUCH by formatters; only essential changes (e.g., a required Next 16 migration step) are allowed.
