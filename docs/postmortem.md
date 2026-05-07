# Postmortem

## What Was Built

Cinematheca v0.1.0 was implemented as a static GitHub Pages app for independent cinema post-production prep. It includes local master intake, metadata display, transcript-to-subtitle generation, EBU R128 loudness recipes, color/restoration controls, delivery presets, festival ZIP generation, IndexedDB artifact storage, PWA setup, version/commit display, repository link, and PayPal support link.

## Was Mode A Correct?

Yes. In hindsight, Mode A was the right choice for v1. The useful core is package generation, planning, preview, and local artifact creation, all of which work without a runtime backend. A server would add privacy and operations costs before the product needs them.

## What Worked

- GitHub Pages from `main` branch `/docs` was enabled at the start.
- The initial JavaScript payload stayed below the 200KB gzip budget.
- FFmpeg and heavier engines are isolated behind lazy adapter boundaries.
- Playwright can smoke-test the built Pages output.

## What Did Not Work

- GitHub Pages cannot provide COOP/COEP headers, so threaded WASM and SharedArrayBuffer-heavy engines are not reliable in v1.
- Browser-only ML translation/restoration remains adapter-level unless users have compatible hardware and model availability.

## Surprises

- The GitHub Pages REST API required a nested JSON body for the source configuration.
- Prettier tried to format generated Pages assets until `.prettierignore` excluded them.
- Dynamic build timestamps dirtied tracked Pages output during pre-push, so build metadata became deterministic and the live commit display moved to GitHub's public API.

## Accepted Tech Debt

- Non-English subtitle tracks are generated as review-required source-preserving tracks unless a future local NLLB adapter is enabled.
- FFmpeg proof transcodes are exposed as capability probes and command plans, not mandatory smoke-test work.
- The DCP-adjacent output is explicitly a review/submission prep package, not a certified theatrical DCP.

## Next Three Improvements

1. Add a real browser Whisper adapter for short audio extraction and transcription.
2. Add optional NLLB model loading with per-language review editing.
3. Add a tiny sample media fixture for FFmpeg WASM proof-export tests outside pre-push hooks.

## Time Spent Vs Estimate

Estimated v1 scaffold and implementation: 2 to 3 hours.

Actual implementation in this session: about 2 hours.
