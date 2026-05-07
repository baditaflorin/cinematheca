# Runbook

## Mode

Cinematheca is Mode A: Pure GitHub Pages.

There is no backend server, no Docker runtime, no nginx, no Prometheus, and no database backup.

## Local Checks

```sh
make lint
make test
make build
make smoke
```

## Pages Preview

```sh
make pages-preview
```

Open:

http://127.0.0.1:4731/cinematheca/

## Common Issues

If assets 404 on Pages, check `base: "/cinematheca/"` in `vite.config.ts`.

If the service worker caches old assets, unregister it from browser developer tools and reload.

If generated packages do not persist, clear IndexedDB for the site and retry.

If FFmpeg WASM does not load, use the generated command plan and package outputs; heavy media engines are lazy optional adapters in v1.

## Resource Sizing

The static app itself is small. Heavy browser operations depend on the user's machine and browser memory. 1080p clips up to 5 minutes are the v1 target.
