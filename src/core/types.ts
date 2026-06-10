import type { MiniWebpackConfig } from "../config/types.js";

export interface CompilerPaths {
  rootDirectory: string;
  entryFile: string;
  outputDirectory: string;
  outputFile: string;
}

export interface CompilerContext {
  command: "build";
  configPath: string;
  config: MiniWebpackConfig;
  paths: CompilerPaths;
}
