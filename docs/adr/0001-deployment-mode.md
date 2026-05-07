# 0001: Deployment Mode

## Status

Accepted

## Context

Cinematheca must let filmmakers process unreleased masters without uploading media to a server. The bootstrap rules require GitHub Pages first, with a runtime backend only if browser execution or build-time generation cannot satisfy v1.

## Decision

Use Mode A: Pure GitHub Pages.

The app is a static Vite build published from `main` branch `/docs`. Processing runs in the browser with TypeScript, Web Workers, IndexedDB, optional OPFS, lazy WASM, and lazy local ML adapters. The public app includes repository and support links:

https://github.com/baditaflorin/cinematheca

https://www.paypal.com/paypalme/florinbadita

## Consequences

Source media stays local to the user's device. There is no runtime API, server database, server-side logging, server storage, or backend deployment. Browser limits mean v1 must expose heavy operations as lazy, explicit actions and provide clear fallbacks when a local engine is unavailable.

## Alternatives Considered

Mode B was rejected because v1 does not depend on shared static datasets. Mode C was rejected because authentication, secrets, cross-device sync, and server mutations are not v1 requirements.
