<div align="center">
  <h1>@distkit/schema</h1>

  <blockquote>
    TypeBox schemas, JSON Schema generation, and registry-building utilities for distkit.
  </blockquote>
</div>

## What's in here

- **Schemas** — registry and registry-item shapes written in [TypeBox](https://github.com/sinclairzx81/typebox), the single source of truth for what a valid item or registry looks like.
- **JSON Schema generation** — a script that compiles the TypeBox schemas into standalone JSON Schema documents, so the schema can be validated against or referenced by tooling outside this repo.
- **Registry-building utilities** — functions for scanning a directory of items, validating each one, and assembling the result into a `registry.json`.

## Installation

```bash
pnpm add @distkit/schema
```

## Usage

Illustrative — match these to your actual exported names.

**Validating an item against the schema:**

```ts
import { RegistryItemSchema } from '@distkit/schema'
import Type from 'typebox'

// throws if `myItem` doesn't match the schema
Type.Assert(RegistryItemSchema, myItem)
```

**Generating JSON Schema from the TypeBox definitions:**

```bash
pnpm schema:generate
```

Outputs standalone `.json` schema files that don't require TypeBox to consume — useful for editor tooling, CI validation, or anyone building against the registry format without pulling in this package.

**Building a registry:**

```ts
import { buildRegistry } from '@distkit/schema'

const registry = await buildRegistry({
  itemsDir: './items',
})
```

Walks a directory of item definitions, validates each against the schema, and returns (or writes) a `registry.json` assembled from the valid ones.

## Package layout

This package ships as a single ESM entry point (`dist/index.mjs`), built with [tsdown](https://github.com/sxzz/tsdown). Run `pnpm build` to produce it, `pnpm dev` to watch, and `pnpm typecheck` / `pnpm lint` before publishing.

## License

MIT