# 0018: Deterministic Pages Build Metadata

## Status

Accepted

## Context

The pre-push hook runs `make build`, and the built `docs/` directory is tracked for GitHub Pages. If build metadata includes the current time or current git commit, every hook run dirties the working tree after the commit.

## Decision

Keep `/build-info.json` deterministic. It contains the app version, a pinned release-commit fallback, and public project URLs. The live page first tries to display the current `main` commit by fetching GitHub's public commits API:

https://api.github.com/repos/baditaflorin/cinematheca/commits/main

## Consequences

Local hooks are idempotent and do not dirty the working tree. The app still shows a real commit on GitHub Pages when the public API is reachable, and falls back to the pinned release commit when it is not.

## Alternatives Considered

Embedding `git rev-parse HEAD` and build timestamps was rejected because it creates an impossible fixed point for tracked Pages builds. Ignoring `docs/build-info.json` was rejected because Pages needs the file.
