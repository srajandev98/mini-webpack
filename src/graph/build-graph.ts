import { readFile } from "node:fs/promises";
import path from "node:path";

import type { CompilerContext } from "../core/types.js";
import { parseImports } from "../parser/imports.js";
import { MiniWebpackError } from "../shared/error.js";
import type { ModuleDependency, ModuleGraph, ModuleRecord } from "./types.js";
import { resolveModulePath } from "./resolve.js";

export async function buildModuleGraph(context: CompilerContext): Promise<ModuleGraph> {
  const modules = new Map<string, ModuleRecord>();
  const visiting = new Set<string>();
  const circularDependencies: Array<{ from: string; to: string }> = [];
  const entryRecord = await visitModule(context.paths.entryFile);

  return {
    entryId: entryRecord.id,
    modules,
    circularDependencies,
  };

  async function visitModule(filePath: string): Promise<ModuleRecord> {
    const normalizedPath = path.resolve(filePath);
    const existingId = createModuleId(context, normalizedPath);
    const existingModule = modules.get(existingId);

    if (existingModule) {
      return existingModule;
    }

    if (visiting.has(normalizedPath)) {
      throw new MiniWebpackError(
        `Internal graph state error while visiting ${normalizedPath}.`,
      );
    }

    visiting.add(normalizedPath);

    const source = await readSourceFile(normalizedPath);
    const parsedImports = parseImports(source);
    const dependencies: ModuleDependency[] = [];
    const record: ModuleRecord = {
      id: existingId,
      filePath: normalizedPath,
      source,
      dependencies,
    };

    modules.set(record.id, record);

    for (const parsedImport of parsedImports) {
      const resolvedPath = await resolveModulePath(normalizedPath, parsedImport.specifier);

      dependencies.push({
        specifier: parsedImport.specifier,
        resolvedPath,
      });

      if (visiting.has(resolvedPath)) {
        circularDependencies.push({
          from: record.id,
          to: createModuleId(context, resolvedPath),
        });
        continue;
      }

      await visitModule(resolvedPath);
    }

    visiting.delete(normalizedPath);
    return record;
  }
}

async function readSourceFile(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    throw new MiniWebpackError(`Unable to read source file: ${filePath}`, {
      cause: error,
    });
  }
}

function createModuleId(context: CompilerContext, filePath: string): string {
  const relativePath = path.relative(context.paths.rootDirectory, filePath);
  const normalized = relativePath.split(path.sep).join("/");
  return normalized.startsWith(".") ? normalized : `./${normalized}`;
}
