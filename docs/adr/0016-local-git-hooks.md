# 0016: Local Git Hooks

## Status

Accepted

## Context

The project must not use GitHub Actions. Checks need to run locally before commits and pushes.

## Decision

Use plain `.githooks/` scripts wired by `git config core.hooksPath .githooks`. Provide `make install-hooks` and manual hook targets:

- pre-commit: format check, lint, typecheck, secret scan.
- commit-msg: Conventional Commits validation.
- pre-push: tests, Pages build, smoke test.
- post-merge and post-checkout: lightweight dependency guidance.

## Consequences

Checks are transparent and require no extra hook manager binary. Contributors must run `make install-hooks` once per clone.

## Alternatives Considered

Lefthook was rejected because it was not installed in the current environment and plain hooks are sufficient for v1.
