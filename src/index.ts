export { run } from "./cli/index.js";
export { loadConfig } from "./config/load-config.js";
export { createCompilerContext } from "./core/compiler.js";
export { buildModuleGraph } from "./graph/build-graph.js";
export { formatGraphReport } from "./graph/format-graph.js";
export { parseImports } from "./parser/imports.js";
export type { MiniWebpackConfig, MiniWebpackUserConfig } from "./config/types.js";
export type { CompilerContext } from "./core/types.js";
export type { ModuleGraph, ModuleRecord, ModuleDependency } from "./graph/types.js";
