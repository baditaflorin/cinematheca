# 0005: Client-Side Storage Strategy

## Status

Accepted

## Context

Media files must not leave the browser, and generated artifacts should be recoverable during the current workflow. Very large source masters should not be duplicated into persistent storage by default.

## Decision

Use `localStorage` for lightweight user preferences and recent project metadata. Use IndexedDB for generated artifacts such as subtitle files, manifests, and package ZIPs. Use object URLs for user-selected media previews. Do not persist source video masters automatically.

## Consequences

The app is privacy-preserving and avoids filling disk with masters. Generated files can be downloaded or cleared by the user. Cross-device sync is not available in v1.

## Alternatives Considered

Always storing source files in IndexedDB or OPFS was rejected because indie masters can be huge and sensitive. Server persistence was rejected because it conflicts with Mode A.
