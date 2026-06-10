# Mini Webpack Plan

## Goal

Build a production-grade Webpack-like bundler in TypeScript focused on modern frontend build performance, extensibility, and operational clarity:

- entry resolution
- dependency graph creation
- module transformation
- bundling into browser-executable output
- extensibility through loaders and plugins

This project should be shaped as a real product that can earn adoption from developers who want a smaller, understandable bundler with modern defaults.

## Product Direction

The project should aim to become:

- a fast, approachable bundler for small and medium frontend apps
- a production-minded codebase with clean architecture
- an extensible alternative for developers who want Webpack concepts without Webpack complexity

That means our design choices should balance:

- simplicity
- performance
- predictable behavior
- compatibility with common frontend workflows
- room for future ecosystem growth

## What We Are Building

We are building a small bundler CLI that:

1. starts from an entry file
2. parses imports and builds a dependency graph
3. transforms source files into executable module functions
4. emits a bundled output file for the browser
5. supports a simple loader pipeline
6. supports a plugin hook system

## End-State Vision

The final project should let a user write:

```js
// src/index.js
import { message } from "./message.js";
import "./styles.css";

console.log(message);
```

and then run something like:

```bash
mini-webpack build
```

to generate:

```text
dist/
  bundle.js
  bundle.css
```

For the project to feel real, we should also target:

- stable configuration semantics
- clear CLI ergonomics
- consistent emitted asset structure
- enough compatibility for real app demos, not only contrived examples

## Product Objectives

This project should deliver:

- reliable module graph construction
- safe AST-based transformation
- extensible asset processing for non-JS files
- stable lifecycle hooks for plugins
- strong correctness, performance, and developer experience

## Adoption Criteria

If we want other developers to actually use this, the bundler needs to be good at a few specific things:

- easy to understand without reading thousands of lines of internals
- fast enough for everyday local builds
- predictable enough that debugging is not painful
- extensible enough for custom project needs
- documented well enough that adoption friction stays low

In practice, that means we should treat:

- configuration design
- errors
- performance reporting
- examples
- upgrade safety

as product features, not polish.

## Project Scope

### MVP

- single entry point
- JavaScript module graph
- relative import resolution
- single-file JS bundle output
- minimal runtime to execute bundled modules
- CLI build command
- clean, documented config file
- error handling that is understandable to a real user

### Next Layer

- TypeScript support
- CSS loader
- JSON loader
- plugin hooks
- watch mode
- source maps or debug-friendly output

### Advanced Layer

- multiple entry points
- code splitting
- asset emission
- tree-shaking experiments
- HMR concepts
- persistent caching
- ecosystem-quality plugin surface
- compatibility work for more realistic app structures

## Proposed Architecture

We should structure the bundler into clear internal stages:

1. Config loading
2. File resolution
3. Module parsing
4. Dependency graph construction
5. Transformation pipeline
6. Bundle generation
7. Asset emission
8. CLI reporting

Suggested folders:

```text
mini-webpack/
  src/
    cli/
    config/
    core/
    graph/
    loaders/
    parser/
    plugins/
    runtime/
    emit/
    shared/
  examples/
  tests/
```

## Product Positioning

We should be honest about where this project fits.

It is unlikely to replace Webpack broadly in early versions, but it can become valuable if it is:

- easier to extend
- easier to debug
- good enough for real static frontend projects
- operationally predictable for real frontend projects

That gives us a strong niche:

"A small but real bundler with modern defaults, predictable behavior, and an extensible architecture."

## Core Concepts We Need

### Module

Represents one source file with:

- file path
- source code
- transformed code
- dependency list
- module id

### Dependency Graph

A graph where:

- nodes are modules
- edges are imports

This is the heart of the bundler.

### Runtime Wrapper

The emitted bundle needs a tiny runtime that:

- stores modules in an object map
- exposes a `require` function
- caches executed modules
- runs the entry module

### Loaders

Functions that transform file contents before bundling.

Examples:

- `.ts` -> JavaScript
- `.css` -> JS module or extracted CSS
- `.json` -> JS export

### Plugins

Hooks that let users tap into lifecycle events without editing core bundler logic.

## Phase Plan

### Phase 1: Project Foundation

Build the minimum skeleton of the tool.

Work:

- ~~initialize TypeScript project structure~~
- ~~create CLI entry point~~
- ~~define config shape~~
- ~~define module and graph types~~
- ~~create example input project~~
- ~~define project principles and compatibility boundaries~~

Deliverable:

~~A runnable CLI command with project structure in place, even if it does not bundle yet.~~

Success criteria:

- ~~`mini-webpack build` command exists~~
- ~~config can be read from a file~~
- ~~example project can be targeted~~
- ~~project boundaries are documented so later phases stay coherent~~

### Phase 2: Entry Resolution and Graph Discovery

Build the bundler's file discovery and dependency graph layer.

Work:

- resolve the entry file
- read source files
- parse `import` statements
- assign module ids
- recursively build the dependency graph

Deliverable:

The bundler can print or serialize a dependency graph from a simple JS project.

Success criteria:

- single entry project graph builds correctly
- circular dependency handling is at least detected or safely represented
- missing file errors are readable

### Phase 3: Basic JS Bundling

Turn the graph into executable browser output.

Work:

- transform modules into wrapped functions
- generate bundle runtime with local `require`
- emit `dist/bundle.js`
- execute the entry module from the bundle
- keep emitted output readable enough for debugging

Deliverable:

A browser-runnable or Node-runnable bundle from plain JS modules.

Success criteria:

- imports resolve correctly inside bundle runtime
- modules execute once and are cached
- bundled output works for a small demo app
- output is understandable enough to inspect manually

### Phase 4: Parser and Transform Layer

Move from naive string handling to a more realistic transformation stage.

Work:

- introduce AST parsing for JavaScript
- rewrite import/export syntax where needed
- normalize dependency extraction through the parser
- separate parsing from emission logic

Deliverable:

A cleaner bundling pipeline that is easier to extend safely.

Success criteria:

- dependency extraction no longer relies on fragile regex
- transformed output handles common ES module syntax
- parser errors point to the source file clearly

### Phase 5: Loader System

Add a flexible way to transform different file types.

Work:

- design loader interface
- apply loaders by file match
- support chained loaders
- implement initial loaders:
  - JavaScript passthrough
  - JSON loader
  - CSS loader

Design note:

We should make the loader API small and stable early, because this is one of the first places real users will extend the bundler.

Deliverable:

The bundler can process more than `.js` files through a configurable transform pipeline.

Success criteria:

- importing JSON works
- importing CSS works in the chosen v1 model
- loader order is deterministic

### Phase 6: Plugin Hooks

Make the tool extensible in a way that resembles real bundlers.

Work:

- define compiler lifecycle hooks
- define plugin interface
- expose hooks such as:
  - `beforeRun`
  - `afterGraph`
  - `beforeEmit`
  - `afterEmit`
- build one example plugin, such as a build time logger
- document plugin authoring from the start

Deliverable:

Users can customize bundler behavior without modifying core internals.

Success criteria:

- plugins can register against hooks
- plugins can inspect compilation data
- example plugin runs during build
- plugin API is simple enough that a third party could realistically use it

### Phase 7: Developer Experience

Make the project pleasant to use and debug.

Work:

- improve CLI output
- add clear error messages
- add build summaries
- add config validation
- add an examples folder and usage docs
- add troubleshooting guidance
- add one polished demo project

Deliverable:

A tool someone else can run and understand.

Success criteria:

- errors are readable
- successful builds show output paths and timings
- example usage is documented
- a new user can get from install to first build without reading internals

### Phase 8: Watch Mode

Add incremental local development support.

Work:

- watch source files for changes
- rebuild only when needed
- debounce file events
- print rebuild diagnostics

Deliverable:

A functional watch mode for iterative development.

Success criteria:

- editing a source file triggers rebuild
- rebuild results remain correct
- repeated rebuilds do not leak state

### Phase 9: Performance and Advanced Features

Push the project from functional to highly competitive.

Possible work:

- cache parsed modules
- parallelize graph work where safe
- add multiple entry points
- extract CSS into separate emitted file
- experiment with source maps
- add simple chunk splitting
- profile large-project behavior
- identify bottlenecks before adding more features

Deliverable:

A more capable bundler with visible engineering depth.

Success criteria:

- build time improves with caching
- architecture supports new output strategies
- advanced features do not break core behavior

## Recommended Milestone Order

If we want the cleanest path, we should implement in this order:

1. Foundation
2. Graph discovery
3. Basic bundling
4. AST parser layer
5. Loaders
6. Plugins
7. DX improvements
8. Watch mode
9. Advanced features

This order keeps us from overengineering before the bundle runtime actually works.

## Testing Strategy

We should test at three levels:

### Unit tests

- path resolution
- dependency extraction
- loader chaining
- plugin hook execution

### Integration tests

- bundle a small multi-file app
- bundle JSON and CSS imports
- verify emitted bundle behavior

### Snapshot tests

- emitted bundle structure
- graph serialization
- CLI output where useful

## Risks

- import parsing can get messy if we delay AST work too long
- loader and plugin APIs can become awkward if added after too much core code is written
- CSS handling can distract from the bundler core if we overscope early
- watch mode can introduce hidden state bugs

## MVP Non-Goals

To stay focused, the first usable version should not try to support:

- full Webpack config compatibility
- Babel-level transformations
- production-grade source maps
- HMR
- tree shaking
- full CommonJS and ESM interop edge cases
- advanced package resolution rules

## Real-World Readiness Roadmap

Once the core phases are done, we should explicitly evaluate the project against real usage concerns:

1. Can a small frontend app use it without hacks?
2. Are rebuilds fast enough to feel competitive?
3. Are error messages better than typical bundler errors?
4. Can a developer write a custom loader or plugin in under an hour?
5. Is the documentation good enough for someone who did not build the project?

If the answer to those is yes, then this becomes a credible production-grade bundler for a focused set of frontend workloads.

## Success Criteria

We should consider the project successful when:

- it bundles a small app from a real entry file
- the emitted runtime correctly resolves internal modules
- loaders can transform JSON and CSS imports
- plugins can observe and extend the build lifecycle
- the codebase is clean enough to explain in an interview or write-up

## Recommended Demo App

Build a tiny demo app using:

- `index.js`
- one utility module
- one JSON config import
- one CSS import

That demo will prove the graph builder, runtime, loaders, and emission pipeline all work together.
