# Contributing to vechain-sdk-js

Thanks for helping improve the SDK!

## Getting Started
- Prereqs: Node 22+, Corepack enabled (`corepack enable`), Yarn 4 (managed by Corepack).
- Install: `corepack yarn install`
- Build: `corepack yarn build` (runs turbo build across packages)

## Development Workflow
- Lint/format: `corepack yarn lint`
- Unit tests on node: `corepack yarn test:node:unit`  
- Full tests with coverage: `corepack yarn test:node:e2e`
- Browser/unit: `corepack yarn test:browser:unit`
- Examples (optional): `corepack yarn build-examples`
- See [here](../docs/tests/test-commands.md) for other test commands
- Keep changes *small and focused*; add/update tests with behavior changes.

## Commit/PR Guidelines
- Target the appropriate branch `sdk-v3`
- Write clear commit messages; prefer conventional style when possible.
- Include tests for fixes/features; update docs where applicable.
- Ensure `corepack yarn lint` and relevant `corepack yarn test:*` pass before submitting.

## Docs & Examples
- Docs live under `docs/`; update as necessary
- Examples line under `examples/`; update and add new examples if needed
- If you add public APIs, update any relevant docs and examples as needed

## Issue & Security
- When opening an issue, include repro steps, expected/actual behavior, and environment info.
- Security reports: do **not** open a public issue; follow responsible disclosure and contact the maintainers privately.

Thanks for contributing!
