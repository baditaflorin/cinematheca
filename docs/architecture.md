# Architecture

## Context

```mermaid
C4Context
  title Cinematheca System Context
  Person(filmmaker, "Independent filmmaker", "Drops a master, prepares subtitles, audio, picture, and delivery package")
  System_Boundary(pagesBoundary, "GitHub Pages") {
    System(cinematheca, "Cinematheca", "Static browser app")
  }
  System_Ext(github, "GitHub Repository", "Public source, stars, latest commit")
  System_Ext(paypal, "PayPal", "Voluntary support link")
  Rel(filmmaker, cinematheca, "Uses locally in browser")
  Rel(cinematheca, github, "Fetches latest public commit metadata")
  Rel(filmmaker, github, "Stars or forks")
  Rel(filmmaker, paypal, "Supports project")
```

Live app:

https://baditaflorin.github.io/cinematheca/

Repository:

https://github.com/baditaflorin/cinematheca

## Containers

```mermaid
C4Container
  title Cinematheca Containers
  Person(user, "Filmmaker")
  System_Boundary(browser, "User browser") {
    Container(ui, "React workbench", "TypeScript + Vite", "Guided post-production workflow")
    ContainerDb(storage, "Local browser storage", "localStorage + IndexedDB", "Preferences and generated artifacts")
    Container(generator, "Package generators", "TypeScript + fflate", "SRT, VTT, ASS, manifest, festival ZIP")
    Container(engine, "Lazy media engines", "FFmpeg WASM + optional browser ML", "Transcode, loudness, subtitle burn-in, restoration adapters")
  }
  System_Boundary(pages, "GitHub Pages") {
    Container(static, "Published static assets", "HTML, CSS, JS, PWA manifest", "Served from main/docs")
  }
  System_Ext(githubApi, "GitHub public API", "Latest main commit")
  Rel(user, static, "Loads")
  Rel(static, ui, "Bootstraps")
  Rel(ui, storage, "Reads and writes")
  Rel(ui, generator, "Creates deliverables")
  Rel(ui, engine, "Lazy-loads on demand")
  Rel(ui, githubApi, "Fetches commit metadata")
```

## Module Boundaries

- `src/features/master`: file intake and metadata.
- `src/features/subtitles`: transcript segmentation and subtitle formats.
- `src/features/audio`: EBU R128 loudness recipes.
- `src/features/picture`: color, restoration, and preview settings.
- `src/features/delivery`: presets, command plans, manifests, ZIP packages.
- `src/features/storage`: local browser persistence.
- `src/features/engines`: lazy FFmpeg and ML capability adapters.

## Pages Boundary

GitHub Pages serves only static files from `main` branch `/docs`. There is no runtime backend, no server database, and no server-side media processing.
