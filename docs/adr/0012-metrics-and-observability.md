# 0012: Metrics and Observability

## Status

Accepted

## Context

Usage analytics could help product decisions, but the default requirement for Mode A/B is no analytics.

## Decision

Ship no analytics in v1. No Plausible script, beacon endpoint, fingerprinting, or tracking cookies are included.

## Consequences

There is no usage dashboard. Privacy is simple to explain: source media and workflow state stay local unless the user downloads or shares artifacts.

## Alternatives Considered

Privacy-preserving analytics were considered but rejected for v1 to keep trust high and implementation simple.
