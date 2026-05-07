# 0004: Static Data Contract

## Status

Accepted

## Context

Mode A has no server data pipeline, but the app still needs stable static files for build metadata, sample presets, and version display.

## Decision

Static runtime files live under the Vite public root and are copied into `docs/` during build:

- `/build-info.json`: app version, git commit, build time, repository URL, PayPal URL.
- `/404.html`: GitHub Pages SPA fallback.

Domain presets are compiled into TypeScript modules because they are small and versioned with the app.

## Consequences

The frontend can show version and commit without a backend. When GitHub's public API is reachable, the app may also show the latest `main` commit for the repository; otherwise it falls back to `/build-info.json`.

## Alternatives Considered

Committed JSON datasets were rejected for v1 because delivery presets are small and do not need independent freshness metadata.
