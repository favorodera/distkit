<div align="center">
  <h1>distkit</h1>

  <p>A minimal registry and CLI for distributing open code. Fork it and build your own.</p>

  <p>
    <a href="./LICENSE"><img src="https://img.shields.io/github/license/favorodera/distkit.svg?style=plastic&label=License" alt="License"></a>
    <img alt="Version" src="https://img.shields.io/github/package-json/v/favorodera/distkit?style=plastic&label=Version">
  </p>

  <p>
    <a href="./packages/core"><img src="https://img.shields.io/badge/Core-blue?style=plastic" alt="Distkit Core"></a>
    <a href="./packages/schema"><img src="https://img.shields.io/badge/Schema-blue?style=plastic" alt="Distkit Schema"></a>
    <a href="./packages/cli"><img src="https://img.shields.io/badge/CLI-blue?style=plastic" alt="Distkit CLI"></a>
  </p>
</div>

## What this is

distkit is a template for building your own open-code distribution system — the kind where items (components, utilities, or whatever you want to ship) get copied into a consumer's project as real, editable files, instead of installed as an opaque dependency. It's not a product to install; it's a working registry and CLI you fork, gut, and adapt into your own.

## What this is not

- **Not an installable package.** Nothing here is published to npm. Clone or fork the repo directly — that's the intended way to use it, not `npm install`.
- **Not roadmap-driven.** See "Maintenance" below.
- **Not opinionated about what you're distributing.** The schema doesn't assume components — see [`packages/schema`](./packages/schema) for how the item-type union works and how to replace it.

## How it fits together

- **`store/`** — the actual source for every deliverable: components, utilities, whatever distkit distributes. This is what gets copied into a consumer's project.
- **`registry/`** — hand-authored manifest entries (`registry/components/*.json`, `registry/utilities/*.json`) describing what's in `store/`, plus the built `registry/index.json` that a resolved CLI actually fetches.
- **`packages/schema`** — TypeBox schemas that validate the manifest entries and the built registry index, plus the scripts that build both.
- **`packages/cli`** — the `distkit` command-line tool: `distkit init` sets up a consumer project, `distkit add component <name>` / `distkit add utility <name>` fetch and install items.
- **`packages/core`** — the package a consumer's project depends on: a thin `defineConfig()` helper for `distkit.config.ts`, plus a re-export of the CLI binary.
- **`apps/playground`** — a real consumer project used to test the whole loop end to end, wired up with its own `distkit.config.ts` pointing at this repo's own registry.

## Using it (the included example)

This repo ships with a small working example — a `button` component and a `props` utility — to demonstrate the full loop. This is what pointing a project at it looks like; once you've forked and built out your own registry, you'd point at that instead:

```ts
// distkit.config.ts
import { defineConfig } from '@distkit/core'

export default defineConfig({
  components: {
    dir: 'src/components',
    import: '@/components'
  },
  registries: {
    distkit: 'https://raw.githubusercontent.com/favorodera/distkit/refs/tags/v1.0.0/registry/index.json',
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
  core/           defineConfig() + CLI binary re-export
  schema/         TypeBox schemas, validation, and registry build scripts

registry/         Manifest entries and the built registry index
store/            Source for every deliverable — what actually gets installed
```

`store` isn't in `packages/` today — it has no `package.json` of its own, and isn't listed in `pnpm-workspace.yaml`. The plan is to give it one anyway: a full package like the others, but never published. The point isn't to make it importable — nothing ever depends on `@distkit/store` — it's so that editing files in `store/` gets the same intellisense, type-checking, and lint coverage as everything under `packages/*`, instead of being plain untracked TypeScript. Wiring that up means adding a `package.json` + `tsconfig.json` to `store/` and adding `'store'` to the `packages:` list in `pnpm-workspace.yaml`.

## Maintenance

This is a personal project, maintained casually rather than on a roadmap. Dependency updates come through automatically via Renovate, and small fixes land as time allows — it just doesn't have my full attention day to day, so don't expect fast turnaround on feature requests. Not abandoned, just unhurried. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
