# 0014: Error Handling Conventions

## Status

Accepted

## Context

Browser media operations fail for many legitimate reasons: codec support, memory pressure, model availability, and file permissions.

## Decision

Model expected failures as typed results where practical. Surface errors through a global toast and contextual panel messages. Never expose stack traces in primary UI. Preserve original errors for tests and development diagnostics.

## Consequences

Users see recoverable actions instead of raw exceptions. Tests can assert specific error codes for pure modules.

## Alternatives Considered

Throwing raw exceptions through React components was rejected because it produces poor UX and brittle tests.
