import process from "node:process";

import { loadConfig } from "../config/load-config.js";
import { createCompilerContext } from "../core/compiler.js";
import { formatGraphReport } from "../graph/format-graph.js";
import { buildModuleGraph } from "../graph/build-graph.js";
import { MiniWebpackError } from "../shared/error.js";

export async function run(argv: string[]): Promise<number> {
  const { command, configPath } = parseArgs(argv);

  if (command !== "build") {
    printUsage();
    return 1;
  }

  try {
    const loadedConfig = await loadConfig(configPath);
    const context = createCompilerContext(loadedConfig);
    const graph = await buildModuleGraph(context);

    process.stdout.write(`${formatGraphReport(context, graph)}\n`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    process.stderr.write(`mini-webpack: ${message}\n`);
    return error instanceof MiniWebpackError ? 1 : 2;
  }
}

interface ParsedArgs {
  command: string | undefined;
  configPath?: string;
}

function parseArgs(argv: string[]): ParsedArgs {
  const [, , command, ...rest] = argv;
  let configPath: string | undefined;

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];

    if (arg === "--config") {
      configPath = rest[index + 1];
      index += 1;
    }
  }

  return { command, configPath };
}

function printUsage(): void {
  process.stdout.write(
    [
      "Usage:",
      "  mini-webpack build [--config <path>]",
      "",
      "Phase 2 commands:",
      "  build    Resolve the entry file and build a dependency graph",
    ].join("\n") + "\n",
  );
}
