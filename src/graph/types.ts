export interface ModuleDependency {
  specifier: string;
  resolvedPath?: string;
}

export interface ModuleRecord {
  id: string;
  filePath: string;
  source: string;
  transformedSource?: string;
  dependencies: ModuleDependency[];
}

export interface ModuleGraph {
  entryId: string;
  modules: Map<string, ModuleRecord>;
  circularDependencies: Array<{
    from: string;
    to: string;
  }>;
}
