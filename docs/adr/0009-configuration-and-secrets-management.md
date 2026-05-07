# 0009: Configuration and Secrets Management

## Status

Accepted

## Context

The frontend is public and cannot hold secrets. GitHub Pages serves static files.

## Decision

Use only public Vite configuration values:

- `VITE_APP_BASE`
- `VITE_REPOSITORY_URL`
- `VITE_PAYPAL_URL`

No API keys, tokens, passwords, private keys, or encrypted secrets are allowed in git or the browser bundle. `.env.example` documents public placeholders.

## Consequences

The app can be forked and deployed without secret provisioning. Any future secret-dependent feature must be rejected, redesigned as BYO-key, or moved to a separately justified Mode C backend.

## Alternatives Considered

Embedding obfuscated secrets was rejected because browser secrets are not secrets.
