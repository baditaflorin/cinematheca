# Cinematheca

![Mode A GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-f0b35b)
![Version](https://img.shields.io/badge/version-0.1.0-6aa67a)
![License MIT](https://img.shields.io/badge/license-MIT-d9573f)

Live app: https://baditaflorin.github.io/cinematheca/

Repository: https://github.com/baditaflorin/cinematheca

Support: https://www.paypal.com/paypalme/florinbadita

Cinematheca is a browser-based post-production toolkit for indie filmmakers: subtitles, loudness, color, restoration, and delivery exports. It keeps masters local, generates review-ready subtitle and delivery packages, and publishes as a static GitHub Pages app.

<img src="docs/screenshot.png" alt="Cinematheca workbench screenshot" width="100%">

## Quickstart

```sh
npm install
make dev
make build
make test
make smoke
```

## Architecture

This is a Mode A GitHub Pages app. Media stays local in the browser; no backend receives source footage.

```mermaid
flowchart LR
  filmmaker["Indie filmmaker"] --> pages["GitHub Pages static app"]
  pages --> browser["Browser workbench"]
  browser --> storage["localStorage + IndexedDB"]
  browser --> generators["SRT/VTT/ASS + festival ZIP generators"]
  browser --> wasm["Lazy FFmpeg WASM and ML adapters"]
  browser --> download["Local downloads"]
```

Architecture docs:

docs/architecture.md

ADR directory:

docs/adr/
