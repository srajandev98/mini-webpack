import { access } from "node:fs/promises";
import path from "node:path";

import { MiniWebpackError } from "../shared/error.js";

const SUPPORTED_EXTENSIONS = [".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx", ".json"];

export async function resolveModulePath(
  importerPath: string,
  specifier: string,
): Promise<string> {
  if (!specifier.startsWith(".")) {
    throw new MiniWebpackError(
      `Unsupported import "${specifier}" in ${importerPath}. Phase 2 only supports relative imports.`,
    );
  }

  const basePath = path.resolve(path.dirname(importerPath), specifier);
  const candidates = buildCandidatePaths(basePath);

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate;
    }
  }

  throw new MiniWebpackError(
    `Unable to resolve import "${specifier}" from ${importerPath}. Checked: ${candidates.join(", ")}`,
  );
}

function buildCandidatePaths(basePath: string): string[] {
  const extension = path.extname(basePath);

  if (extension.length > 0) {
    return [basePath];
  }

  return [
    ...SUPPORTED_EXTENSIONS.map((candidateExtension) => `${basePath}${candidateExtension}`),
    ...SUPPORTED_EXTENSIONS.map((candidateExtension) =>
      path.join(basePath, `index${candidateExtension}`),
    ),
  ];
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}
