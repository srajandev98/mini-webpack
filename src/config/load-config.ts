import { readFile } from "node:fs/promises";
import path from "node:path";

import { applyConfigDefaults } from "./defaults.js";
import type { MiniWebpackConfig, MiniWebpackUserConfig } from "./types.js";
import { MiniWebpackError } from "../shared/error.js";

export const DEFAULT_CONFIG_FILE = "mini-webpack.config.json";

export interface LoadedConfig {
  config: MiniWebpackConfig;
  configPath: string;
}

export async function loadConfig(configPath?: string): Promise<LoadedConfig> {
  const resolvedPath = path.resolve(process.cwd(), configPath ?? DEFAULT_CONFIG_FILE);
  const raw = await readConfigFile(resolvedPath);
  const parsed = parseConfig(raw, resolvedPath);
  const normalized = applyConfigDefaults(parsed);

  return {
    config: normalized,
    configPath: resolvedPath,
  };
}

async function readConfigFile(configPath: string): Promise<string> {
  try {
    return await readFile(configPath, "utf8");
  } catch (error) {
    throw new MiniWebpackError(
      `Unable to read config at ${configPath}. Create the file or pass --config with an explicit path.`,
      { cause: error },
    );
  }
}

function parseConfig(raw: string, configPath: string): MiniWebpackUserConfig {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new MiniWebpackError(`Config at ${configPath} is not valid JSON.`, {
      cause: error,
    });
  }

  if (!parsed || typeof parsed !== "object") {
    throw new MiniWebpackError(`Config at ${configPath} must be a JSON object.`);
  }

  const candidate = parsed as Record<string, unknown>;

  if (typeof candidate.entry !== "string" || candidate.entry.length === 0) {
    throw new MiniWebpackError(`Config at ${configPath} must define a non-empty "entry" string.`);
  }

  if (candidate.root !== undefined && typeof candidate.root !== "string") {
    throw new MiniWebpackError(`Config at ${configPath} has an invalid "root" value.`);
  }

  if (candidate.output !== undefined && typeof candidate.output !== "object") {
    throw new MiniWebpackError(`Config at ${configPath} has an invalid "output" value.`);
  }

  return candidate as MiniWebpackUserConfig;
}
