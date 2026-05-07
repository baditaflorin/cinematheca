import { execSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, "");
const publicDir = join(root, "public");
const docsDir = join(root, "docs");
const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));

function run(command, fallback) {
  try {
    return execSync(command, { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return fallback;
  }
}

mkdirSync(publicDir, { recursive: true });
mkdirSync(docsDir, { recursive: true });

for (const entry of [
  "assets",
  "sw.js",
  "workbox-*.js",
  "registerSW.js",
  "manifest.webmanifest"
]) {
  if (entry.includes("*")) {
    continue;
  }
  rmSync(join(docsDir, entry), { recursive: true, force: true });
}

const info = {
  version: packageJson.version,
  commit: run("git rev-parse --short=12 HEAD", "development"),
  fullCommit: run("git rev-parse HEAD", "development"),
  branch: run("git branch --show-current", "main"),
  builtAt: new Date().toISOString(),
  repositoryUrl: "https://github.com/baditaflorin/cinematheca",
  paypalUrl: "https://www.paypal.com/paypalme/florinbadita",
  pagesUrl: "https://baditaflorin.github.io/cinematheca/"
};

writeFileSync(join(publicDir, "build-info.json"), `${JSON.stringify(info, null, 2)}\n`);
