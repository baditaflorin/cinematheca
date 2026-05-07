# 0015: Deployment Topology

## Status

Accepted

## Context

Mode A deploys only static assets to GitHub Pages.

## Decision

Use GitHub Pages only:

https://baditaflorin.github.io/cinematheca/

There is no Docker Compose stack, nginx, TLS configuration, Prometheus, or backend host port. Deployment documentation lives in `docs/deploy.md`; no `deploy/` directory is required.

## Consequences

Operational work is limited to building, committing, pushing, and verifying Pages. Custom domains can be added later with a `CNAME` file and DNS records.

## Alternatives Considered

Docker deployment was rejected because no runtime backend exists.
