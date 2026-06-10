export interface ImportStatement {
  specifier: string;
}

const IMPORT_PATTERN =
  /\bimport\s+(?:[^"'`]+?\s+from\s+)?["']([^"'`\n\r]+)["']\s*;?/g;

export function parseImports(source: string): ImportStatement[] {
  const imports: ImportStatement[] = [];

  for (const match of source.matchAll(IMPORT_PATTERN)) {
    const specifier = match[1];

    if (!specifier) {
      continue;
    }

    imports.push({ specifier });
  }

  return imports;
}
