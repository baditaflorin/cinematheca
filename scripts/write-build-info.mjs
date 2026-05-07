import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, "");
const publicDir = join(root, "public");
const docsDir = join(root, "docs");
const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));

mkdirSync(publicDir, { recursive: true });
mkdirSync(docsDir, { recursive: true });

for (const entry of [
  "assets",
  "sw.js",
  "sw.js.map",
  "registerSW.js",
  "manifest.webmanifest"
]) {
  rmSync(join(docsDir, entry), { recursive: true, force: true });
}

for (const entry of readdirSync(docsDir)) {
  if (/^workbox-.*\.js(\.map)?$/.test(entry)) {
    rmSync(join(docsDir, entry), { force: true });
  }
}

const info = {
  version: packageJson.version,
  commit: packageJson.cinematheca.releaseCommit,
  fullCommit: packageJson.cinematheca.releaseCommit,
  branch: "main",
  builtAt: "deterministic-pages-build",
  repositoryUrl: "https://github.com/baditaflorin/cinematheca",
  paypalUrl: "https://www.paypal.com/paypalme/florinbadita",
  pagesUrl: "https://baditaflorin.github.io/cinematheca/"
};

writeFileSync(join(publicDir, "build-info.json"), `${JSON.stringify(info, null, 2)}\n`);
