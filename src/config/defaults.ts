import type { MiniWebpackConfig, MiniWebpackUserConfig } from "./types.js";

export const DEFAULT_OUTPUT_DIRECTORY = "dist";
export const DEFAULT_OUTPUT_FILENAME = "bundle.js";

export function applyConfigDefaults(
  config: MiniWebpackUserConfig,
): MiniWebpackConfig {
  return {
    root: config.root ?? ".",
    entry: config.entry,
    output: {
      path: config.output?.path ?? DEFAULT_OUTPUT_DIRECTORY,
      filename: config.output?.filename ?? DEFAULT_OUTPUT_FILENAME,
    },
  };
}
