# 0010: GitHub Pages Publishing Strategy

## Status

Accepted

## Context

The live GitHub Pages URL is a first-class deliverable from the first commit. The app must work under the repository subpath.

## Decision

Publish from `main` branch `/docs`:

https://baditaflorin.github.io/cinematheca/

Vite builds to `docs/` with `base: "/cinematheca/"`. Built assets use hashed filenames. `docs/404.html` is emitted as an SPA fallback. The `.gitignore` excludes `dist/` but intentionally does not exclude `docs/`.

## Consequences

The published site is committed and reviewable. Rollback is a normal git revert of the publishing commit. Build metadata is regenerated before each Pages build.

## Alternatives Considered

A `gh-pages` branch was rejected because it hides published artifacts away from `main`. Publishing from repository root was rejected because source and built assets would be mixed.
