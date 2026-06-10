import path from "node:path";

import type { CompilerContext } from "../core/types.js";
import type { ModuleGraph } from "./types.js";

export function formatGraphReport(
  context: CompilerContext,
  graph: ModuleGraph,
): string {
  const lines = [
    "mini-webpack graph ready",
    `command: ${context.command}`,
    `config: ${context.configPath}`,
    `root: ${context.paths.rootDirectory}`,
    `entry: ${graph.entryId}`,
    `modules: ${graph.modules.size}`,
    `circularDependencies: ${graph.circularDependencies.length}`,
    "graph:",
  ];

  const moduleLines = [...graph.modules.values()]
    .sort((left, right) => left.id.localeCompare(right.id))
    .flatMap((moduleRecord) => {
      const dependencies =
        moduleRecord.dependencies.length === 0
          ? ["  deps: none"]
          : moduleRecord.dependencies.map((dependency) => {
              const resolved = dependency.resolvedPath
                ? toProjectRelative(context, dependency.resolvedPath)
                : "unresolved";
              return `  dep: ${dependency.specifier} -> ${resolved}`;
            });

      return [`- ${moduleRecord.id}`, ...dependencies];
    });

  lines.push(...moduleLines);

  if (graph.circularDependencies.length > 0) {
    lines.push("cycles:");
    lines.push(
      ...graph.circularDependencies.map((cycle) => `- ${cycle.from} -> ${cycle.to}`),
    );
  }

  return lines.join("\n");
}

function toProjectRelative(context: CompilerContext, targetPath: string): string {
  const relativePath = path.relative(context.paths.rootDirectory, targetPath);
  const normalized = relativePath.split(path.sep).join("/");
  return normalized.startsWith(".") ? normalized : `./${normalized}`;
}
