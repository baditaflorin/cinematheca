# 0017: Dependency Policy

## Status

Accepted

## Context

The project touches media workflows where custom implementations can be fragile. It also needs to keep the initial bundle small.

## Decision

Use production-ready libraries for core concerns:

- Vite, React, TypeScript for the app.
- Zod for schema validation.
- TanStack Query for fetch caching.
- Comlink for worker boundaries.
- idb for IndexedDB.
- fflate for ZIP generation.
- Lucide for icons.
- FFmpeg WASM and browser ML adapters are lazy-loaded behind explicit user actions.

Avoid new dependencies unless they replace meaningful custom code or isolate a risky browser API.

## Consequences

Core logic stays small and testable while specialized media work relies on established projects. Dependency updates require local tests and smoke checks.

## Alternatives Considered

Hand-rolled ZIP generation, IndexedDB wrappers, and icon systems were rejected.
