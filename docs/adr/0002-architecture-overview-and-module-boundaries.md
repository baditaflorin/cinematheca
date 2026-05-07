# 0002: Architecture Overview and Module Boundaries

## Status

Accepted

## Context

The app needs a guided post-production workflow without a backend. The codebase should stay modular enough to replace experimental local engines as browser media tooling improves.

## Decision

Use a feature-oriented frontend architecture:

- `features/master`: file intake, browser metadata, preview URLs.
- `features/subtitles`: transcript segmentation, SRT, VTT, ASS generation, translation adapter boundary.
- `features/audio`: EBU R128/loudnorm recipes and audio deliverable metadata.
- `features/picture`: color grade, upscale, restoration, and frame interpolation recipes.
- `features/delivery`: delivery presets, package manifests, festival ZIP generation.
- `features/storage`: local persistence for settings, project state, and generated artifacts.
- `features/engines`: lazy boundaries for FFmpeg WASM and browser ML engines.
- `shared`: UI, formatting, errors, build metadata, and common types.

## Consequences

Feature code can evolve independently and tests can focus on pure workflow logic. Heavy engines remain isolated from the initial bundle and from core UI rendering.

## Alternatives Considered

A page-based structure was rejected because the app is one workflow surface. A monolithic `utils` layer was rejected because media concerns need clear ownership.
