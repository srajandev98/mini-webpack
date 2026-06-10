# Architecture Foundations

## Product Principles

- Prioritize deterministic builds over hidden magic.
- Keep the core pipeline composable so loaders and plugins remain first-class.
- Make diagnostics explicit and readable.
- Prefer stable internal contracts to convenience-driven shortcuts.
- Keep emitted outputs and resolution rules predictable across environments.

## Compatibility Boundaries

Phase 1 intentionally supports:

- one explicit config file
- one explicit entry point
- one explicit output directory
- local project-relative paths
- CLI-driven builds

Phase 1 intentionally does not support:

- package-level module resolution
- loader execution
- plugin execution
- code transformation
- bundle emission
- watch mode

## Planned Internal Pipeline

1. Load configuration.
2. Resolve absolute project paths.
3. Construct a compiler context.
4. Discover and parse modules.
5. Build a dependency graph.
6. Transform modules.
7. Emit artifacts.

Phase 1 implements steps 1 through 3.
