# syntax=docker/dockerfile:1.7
# Multi-stage Dockerfile for Next.js (standalone output) on distroless

# node 25+ no longer bundles corepack; install pnpm directly via npm at the version
# pinned in package.json's `packageManager` field.
ARG PNPM_VERSION=11.1.3

# ---- Stage 1: deps (install only) ----
FROM node:26-alpine@sha256:e71ac5e964b9201072425d59d2e876359efa25dc96bb1768cb73295728d6e4ea AS deps
ARG PNPM_VERSION
RUN apk add --no-cache libc6-compat && npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Stage 2: builder ----
FROM node:26-alpine@sha256:e71ac5e964b9201072425d59d2e876359efa25dc96bb1768cb73295728d6e4ea AS builder
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- Stage 3: runner (distroless, non-root) ----
FROM gcr.io/distroless/nodejs26-debian13@sha256:89dcee6aec39e4c50acf16bf3669efdfb06f88c8abaf6be79d2e6385c3f6d648 AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

USER nonroot

EXPOSE 3000

CMD ["server.js"]
