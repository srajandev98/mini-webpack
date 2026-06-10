import path from "node:path";

import type { LoadedConfig } from "../config/load-config.js";
import type { CompilerContext } from "./types.js";

export function createCompilerContext(loaded: LoadedConfig): CompilerContext {
  const projectRoot = path.resolve(path.dirname(loaded.configPath), loaded.config.root);
  const entryFile = path.resolve(projectRoot, loaded.config.entry);
  const outputDirectory = path.resolve(projectRoot, loaded.config.output.path);
  const outputFile = path.resolve(outputDirectory, loaded.config.output.filename);

  return {
    command: "build",
    configPath: loaded.configPath,
    config: loaded.config,
    paths: {
      rootDirectory: projectRoot,
      entryFile,
      outputDirectory,
      outputFile,
    },
  };
}
