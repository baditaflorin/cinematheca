# 0006: WASM Modules

## Status

Accepted

## Context

Cinematheca's source stack includes FFmpeg, libass, color tooling, and local ML engines. GitHub Pages cannot set custom COOP/COEP headers, so SharedArrayBuffer-dependent builds are not reliable.

## Decision

Lazy-load browser-compatible, single-thread-capable modules behind user actions:

- FFmpeg WASM for optional local transcodes, audio extraction, subtitle burn-in, loudnorm analysis, and delivery proof exports.
- Browser ML adapters for Whisper, NLLB, restoration, and upscale experiments when models are available in the user's browser environment.
- Pure TypeScript generators for SRT, VTT, ASS, manifests, and festival package ZIPs.

The default happy path never requires SharedArrayBuffer.

## Consequences

The initial page remains light, and unsupported browsers can still generate practical package assets. Some heavy operations will be slow and memory-bound in browser-only v1.

## Alternatives Considered

Threaded FFmpeg and server-side processing were rejected for v1. Threaded WASM needs headers GitHub Pages cannot provide, and a server would compromise the local-media privacy model.
