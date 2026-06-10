import { access } from "node:fs/promises";
import process from "node:process";

import { loadConfig } from "../config/load-config.js";
import { createCompilerContext } from "../core/compiler.js";
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

    await assertPathExists(context.paths.entryFile, "entry file");

    process.stdout.write(`${formatContext(context)}\n`);
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

async function assertPathExists(targetPath: string, label: string): Promise<void> {
  try {
    await access(targetPath);
  } catch (error) {
    throw new MiniWebpackError(`Resolved ${label} does not exist: ${targetPath}`, {
      cause: error,
    });
  }
}

function formatContext(context: ReturnType<typeof createCompilerContext>): string {
  return [
    "mini-webpack foundation ready",
    `command: ${context.command}`,
    `config: ${context.configPath}`,
    `root: ${context.paths.rootDirectory}`,
    `entry: ${context.paths.entryFile}`,
    `outputDir: ${context.paths.outputDirectory}`,
    `outputFile: ${context.paths.outputFile}`,
  ].join("\n");
}

function printUsage(): void {
  process.stdout.write(
    [
      "Usage:",
      "  mini-webpack build [--config <path>]",
      "",
      "Phase 1 commands:",
      "  build    Load config and resolve compiler context",
    ].join("\n") + "\n",
  );
}
