#!/usr/bin/env node

import { access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const distEntry = path.resolve(process.cwd(), "dist/cli/index.js");
const srcEntry = path.resolve(process.cwd(), "src/cli/index.ts");

main().catch((error) => {
  process.stderr.write(`mini-webpack: ${error instanceof Error ? error.message : "Unknown error."}\n`);
  process.exit(1);
});

async function main() {
  try {
    await access(distEntry);
    const mod = await import(pathToFileUrl(distEntry));
    const exitCode = await mod.run(process.argv);
    process.exit(exitCode);
  } catch {
    process.stderr.write(
      [
        "mini-webpack: compiled CLI not found.",
        `Expected build output at ${distEntry}.`,
        `TypeScript source is available at ${srcEntry}.`,
        "Run `npm install` and `npm run build` to compile the CLI.",
      ].join("\n") + "\n",
    );
    process.exit(1);
  }
}

function pathToFileUrl(filePath) {
  const resolved = path.resolve(filePath);
  const normalized = resolved.replace(/\\/g, "/");
  const withLeadingSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return `file://${withLeadingSlash}`;
}
