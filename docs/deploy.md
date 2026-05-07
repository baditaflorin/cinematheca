# Deployment

Live app:

https://baditaflorin.github.io/cinematheca/

Repository:

https://github.com/baditaflorin/cinematheca

## Publishing Strategy

Cinematheca publishes from `main` branch `/docs`.

The build command is:

```sh
make build
```

The generated `docs/` folder is committed to git because GitHub Pages serves it directly.

## Manual Publish

```sh
npm install
make test
make build
git add .
git commit -m "build: publish pages"
git push
```

## Rollback

Revert the commit that changed `docs/` and push `main` again:

```sh
git revert <commit_sha>
git push
```

## Custom Domain

No custom domain is configured in v1. To add one later, create `docs/CNAME` with the domain, configure DNS with the provider, and verify HTTPS in the GitHub Pages settings.

GitHub Pages settings:

https://github.com/baditaflorin/cinematheca/settings/pages

## Pages Gotchas

- The Vite base path is `/cinematheca/`.
- GitHub Pages does not support `_headers` or `_redirects`.
- `404.html` is copied from `index.html` for SPA fallback.
- Service worker scope must stay under `/cinematheca/`.
