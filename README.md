# mini-webpack

`mini-webpack` is a production-grade bundler project inspired by Webpack's extensible architecture, with a smaller surface area and clearer defaults.

## Current Status

Phase 1 is implemented:

- project structure
- CLI entry point
- config contract and loader
- compiler context bootstrap
- example app target

Phase 2 will build the dependency graph layer.

## Quick Start

1. Install dependencies with `npm install`.
2. Run `npm run build`.
3. Run `node ./bin/mini-webpack.js build --config ./examples/basic-app/mini-webpack.config.json`.

The current build command validates config, resolves the target project, and prints the compilation context that later phases will consume.
