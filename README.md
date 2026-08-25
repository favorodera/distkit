<div align="center">
  <h1>distkit</h1>

  <p>A minimal registry and CLI for distributing open code. Fork it and build your own.</p>

  <p>
    <a href="./LICENSE"><img src="https://img.shields.io/github/license/favorodera/distkit.svg?style=plastic&label=License" alt="License"></a>
    <img alt="Version" src="https://img.shields.io/github/package-json/v/favorodera/distkit?style=plastic&label=NPM%20Version">
  </p>

  <p>
    <a href="./packages/core"><img src="https://img.shields.io/badge/Core-blue?style=plastic" alt="Distkit Core"></a>
    <a href="./packages/schema"><img src="https://img.shields.io/badge/Schema-blue?style=plastic" alt="Distkit Schema"></a>
    <a href="./packages/cli"><img src="https://img.shields.io/badge/CLI-blue?style=plastic" alt="Distkit CLI"></a>
  </p>
</div>

## What this is

distkit is an open-code distribution system: a **registry** — a schema-validated catalog of installable items — and a **CLI** (`distkit`) that resolves items from a registry and writes them into a consumer's project. Similar in spirit to how shadcn/ui or shadcn-vue distribute components, but not tied to components or to any one framework — an item can be a component, a utility, or something else entirely, since nothing in the schema requires exactly these two.

## What this is not

- **Not published to npm today.** The release pipeline supports it ([Relizy](https://relizy.dev/) is configured for a public npm publish), but publishing is intentionally disabled for now — the release workflow runs with `--no-publish`.
- **Not roadmap-driven.** See "Maintenance" below.
- **Not opinionated about what you're distributing.** The schema doesn't assume components — see [`packages/schema`](./packages/schema) for how the item-type union works and how to replace it.

## How it fits together

- **`store/`** — the actual source for every deliverable: components, utilities, whatever distkit distributes. This is what gets copied into a consumer's project.
- **`registry/`** — hand-authored manifest entries (`registry/components/*.json`, `registry/utilities/*.json`) describing what's in `store/`, plus the built `registry/index.json` that consumers actually fetch.
- **`packages/schema`** — TypeBox schemas that validate the manifest entries and the built registry index, plus the scripts that build both.
- **`packages/cli`** — the `distkit` command-line tool: `distkit init` sets up a consumer project, `distkit add component <name>` / `distkit add utility <name>` fetch and install items.
- **`packages/core`** — the package a consumer actually installs: a thin `defineConfig()` helper for `distkit.config.ts`, plus a re-export of the CLI binary.
- **`apps/playground`** — a real consumer project used to test the whole loop end to end, wired up with its own `distkit.config.ts` pointing at this repo's registry.

## Using it

```ts
// distkit.config.ts
import { defineConfig } from '@distkit/core'

export default defineConfig({
  components: {
    dir: 'src/components',
    import: '@/components'
  },
  registries: {
    distkit: 'https://raw.githubusercontent.com/favorodera/distkit/refs/tags/v0.1.0-alpha.0/registry/index.json',
  },
  utilities: {
    dir: 'src/utils',
    import: '@/utils'
  },
})
```

```bash
distkit init
distkit add component button
distkit add utility props
```

Each `add` resolves the item's transitive dependencies — other items, npm packages — from the registry and installs everything into the directories configured above.

## Where things live

```text
apps/
  playground/     A real project used to test distkit end to end

packages/
  cli/            The `distkit` command-line tool
  core/           defineConfig() + CLI binary re-export — what consumers install
  schema/         TypeBox schemas, validation, and registry build scripts

registry/         Manifest entries and the built registry index consumers fetch
store/            Source for every deliverable — what actually gets installed
```

`store` isn't in `packages/` today — it has no `package.json` of its own, and isn't listed in `pnpm-workspace.yaml`. The plan is to give it one anyway: a full package like the others, but never published. The point isn't to make it importable — nothing ever depends on `@distkit/store` — it's so that editing files in `store/` gets the same intellisense, type-checking, and lint coverage as everything under `packages/*`, instead of being plain untracked TypeScript. Wiring that up means adding a `package.json` + `tsconfig.json` to `store/` and adding `'store'` to the `packages:` list in `pnpm-workspace.yaml`.

## Maintenance

This is a personal project, maintained casually rather than on a roadmap. Dependency updates come through automatically via Renovate, and small fixes land as time allows — it just doesn't have my full attention day to day, so don't expect fast turnaround on feature requests. Not abandoned, just unhurried. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT