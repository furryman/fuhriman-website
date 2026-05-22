# Fuhriman Portfolio Website

Personal portfolio for Adam Fuhriman — DevOps engineer. Single-page site with a dedicated `/how-its-built` technical deep-dive covering the infrastructure that ships it.

Live: <https://fuhriman.org>

## Tech stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript strict mode
- **Styling**: CSS Modules + CSS custom properties (Warm Dark + Amber design system, no Tailwind)
- **Animation**: `motion` for declarative reveals; `three` + `@react-three/fiber` for the 3D K8s cluster in the hero; `cmdk` for the ⌘K command palette
- **Tests**: Vitest 4 + React Testing Library + happy-dom (95% coverage gate), Playwright for smoke tests, Lighthouse CI for budgets
- **Lint + format**: Biome 2
- **Package manager**: pnpm (corepack-pinned)
- **Runtime image**: multi-stage Docker build → `gcr.io/distroless/nodejs26-debian13`, amd64
- **Deploy**: GitHub Actions → Docker Hub → Helm chart update → ArgoCD → k3s on EC2

## Quick start

```bash
corepack enable           # one-time: enables the pinned pnpm version
pnpm install
pnpm dev                  # http://localhost:3000
```

No `.env` is required — the app itself has zero runtime env vars.

## Common scripts

```bash
pnpm build                # Production build (Next.js standalone output)
pnpm start                # Run the production server
pnpm check                # Biome lint + format (CI gate)
pnpm test                 # Vitest unit tests
pnpm coverage             # Vitest with v8 coverage; gate at 95/95/95/95
pnpm e2e                  # Playwright smoke tests (run pnpm e2e:install first)
pnpm lighthouse           # Lighthouse CI against the built standalone server
```

## Docker

```bash
docker build -t furryman/fuhriman-website:latest .
docker run -p 3000:3000 furryman/fuhriman-website:latest
```

The builder stage runs `pnpm install --frozen-lockfile` and `pnpm build`; the runtime stage is distroless and starts `node server.js` directly from the standalone output.

## Project layout

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx           Root layout with AmbientBackground + CommandPalette
│   │   ├── page.tsx             Single-page portfolio composition
│   │   ├── globals.css          Design tokens, utility classes, view transitions
│   │   └── how-its-built/       Technical deep-dive route
│   └── components/              Co-located *.tsx + *.module.css + *.test.tsx
├── public/
│   ├── headshot.jpg
│   ├── resume.pdf
│   ├── favicon.svg
│   ├── spotify-top.json         Refreshed weekly by GitHub Actions
│   └── steam-recent.json        Refreshed weekly by GitHub Actions
├── scripts/                     Spotify + Steam refresh scripts (CI-only)
├── tests/e2e/                   Playwright smoke tests
├── .github/workflows/           build-deploy.yaml + interests-refresh.yaml
└── Dockerfile                   Multi-stage → distroless
```

## CI / CD

Push to `main` triggers six parallel quality-gate jobs in GitHub Actions: `lint`, `typecheck`, `test` (with coverage upload), `build`, `e2e`, `lighthouse`. After all pass, a `docker` job builds and pushes the amd64 image (Trivy v0.69.3 CVE scan, HIGH/CRITICAL severities, `--ignore-unfixed`). A `deploy` job then bumps the image tag in [`furryman/eks-helm-charts`](https://github.com/furryman/eks-helm-charts) via `yq` and pushes; ArgoCD picks up the change and syncs the cluster.

### Required secrets

| Secret | Purpose |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub login |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `GH_PAT` | GitHub PAT with `repo` scope — used to push the helm-chart bump AND by the weekly interests refresh (default `GITHUB_TOKEN` pushes don't trigger downstream workflows) |
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` / `SPOTIFY_REFRESH_TOKEN` | Weekly Spotify "top artists" refresh — see `docs/spotify-setup.md` |
| `STEAM_API_KEY` / `STEAM_ID_64` | Weekly Steam "recently played" refresh |
| `STEAM_BLOCKLIST_APPIDS` | (optional) Comma-separated appids to hide from the public list |

## Related repos

- [`furryman/terraform`](https://github.com/furryman/terraform) — AWS VPC, EC2, k3s, iptables hairpin NAT fix
- [`furryman/eks-helm-charts`](https://github.com/furryman/eks-helm-charts) — Helm charts for cert-manager, ingress-nginx, and the website
- [`furryman/argocd-app-of-apps`](https://github.com/furryman/argocd-app-of-apps) — Parent ArgoCD Application with sync waves

## Further reading

- `CLAUDE.md` — repository conventions and architecture notes for contributors (and AI coding assistants)
- `docs/spotify-setup.md` — one-time Spotify OAuth setup
- `/how-its-built` (on the live site) — full architectural deep-dive with infrastructure code samples

## License

MIT
