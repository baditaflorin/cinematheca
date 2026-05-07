# 0008: Go Backend Project Layout

## Status

Accepted

## Context

The bootstrap template defines a Go backend layout for Modes B and C. Cinematheca v1 is Mode A.

## Decision

Do not include a Go backend. Do not create `cmd/`, `internal/`, `pkg/`, `api/`, or Docker runtime folders for v1.

## Consequences

There are no Go binaries, no runtime API, no server health checks, and no server metrics. Hook targets skip Go checks when no Go files are present.

## Alternatives Considered

A tiny Go API was rejected because it would add operational burden without satisfying a v1 requirement.
