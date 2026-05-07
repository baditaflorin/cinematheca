# 0013: Testing Strategy

## Status

Accepted

## Context

The app has pure generation logic, browser storage, and UI workflow states. Checks need to run locally without GitHub Actions.

## Decision

Use Vitest for unit tests on subtitle, delivery, storage, and formatting logic. Use Playwright for a static Pages smoke test that builds the app, serves `docs/`, loads the homepage, checks repository/support/version UI, and runs one package-generation path.

## Consequences

`make test` and `make smoke` are the core local verification gates. Heavier FFmpeg and ML engines are tested at adapter boundaries in v1 rather than in every smoke run.

## Alternatives Considered

Full media transcode e2e tests were rejected for local hooks because WASM startup and model downloads would be slow and flaky.
