# 0003: Frontend Framework and Build Tooling

## Status

Accepted

## Context

The frontend needs strict TypeScript, a fast local developer loop, GitHub Pages base-path support, and a small initial payload. The UI is interactive enough to benefit from a component model.

## Decision

Use React, TypeScript strict mode, and Vite. Use Vitest for unit tests, Playwright for smoke/e2e tests, ESLint and Prettier for local checks, and `lucide-react` for accessible icon controls.

## Consequences

Vite handles hashed assets and the `/cinematheca/` base path cleanly. React gives a predictable component model while keeping local state and worker boundaries explicit.

## Alternatives Considered

Plain TypeScript was rejected because the workflow has enough stateful UI to justify components. Next.js was rejected because server rendering and routing infrastructure are unnecessary for GitHub Pages Mode A.
