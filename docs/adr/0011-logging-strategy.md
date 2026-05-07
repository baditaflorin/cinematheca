# 0011: Logging Strategy

## Status

Accepted

## Context

Mode A has no server logs. Browser logs should help local debugging without leaking user media details or creating noisy production consoles.

## Decision

Use user-visible status and error messages for workflow failures. Production code must avoid routine `console.log`. Errors may be reported to the console only when they are also surfaced in the UI and contain no file contents or transcript text.

## Consequences

Users get actionable feedback without silent failures. The app has no centralized observability in v1.

## Alternatives Considered

Remote logging was rejected because it would create privacy and consent concerns for unreleased film workflows.
