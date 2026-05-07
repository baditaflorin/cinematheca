.PHONY: help install-hooks dev build data test test-integration smoke lint fmt pages-preview clean hooks-pre-commit hooks-commit-msg hooks-pre-push release

help:
	@printf "%s\n" \
	"make install-hooks     wire .githooks" \
	"make dev               run Vite locally" \
	"make build             build GitHub Pages site into docs/" \
	"make data              Mode A no-op" \
	"make test              unit tests" \
	"make test-integration  Playwright e2e tests" \
	"make smoke             build docs/ and run smoke tests" \
	"make lint              ESLint, Prettier check, typecheck, gitleaks" \
	"make fmt               autoformat" \
	"make pages-preview     serve docs/ locally as Pages" \
	"make clean             remove local generated outputs"

install-hooks:
	git config core.hooksPath .githooks
	chmod +x .githooks/*

dev:
	npm run dev

build:
	npm run build

data:
	npm run data

test:
	npm run test

test-integration:
	npm run test:e2e

smoke:
	npm run smoke

lint:
	npm run fmt:check
	npm run lint
	npm run typecheck
	gitleaks detect --source . --redact --no-git

fmt:
	npm run fmt

pages-preview:
	npx vite preview --host 127.0.0.1 --port 4173 --outDir docs

hooks-pre-commit:
	.githooks/pre-commit

hooks-commit-msg:
	.githooks/commit-msg .git/COMMIT_EDITMSG

hooks-pre-push:
	.githooks/pre-push

release:
	@test -n "$(VERSION)" || (echo "VERSION=vX.Y.Z is required" && exit 1)
	npm version "$(VERSION)" --no-git-tag-version
	make build
	git add package.json package-lock.json docs public/build-info.json
	git commit -m "chore: release $(VERSION)"
	git tag "$(VERSION)"
	git push && git push --tags

clean:
	rm -rf coverage playwright-report test-results dist dist-data node_modules/.tmp
