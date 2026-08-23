<div align="center">
  <h1>@distkit/schema</h1>

  <blockquote>
    TypeBox schemas, JSON Schema generation, and registry-building utilities for distkit.
  </blockquote>
</div>

## What's in here

- TypeBox schemas for the shapes this particular registry deals with: a **component**, a **utility**, and the **registry** index itself.

  Component and utility demonstrate the base-shape-plus-union pattern—they're example item types, not a required spec. Swap them for your own types if distributing something other than UI components.

- Two scripts that consume those schemas:
  - `generate-json-schemas.ts` - Regenerates the JSON Schema files in `json-schemas/`.
  - `build-registry.ts` - Builds the actual `registry/index.json` from hand-authored item entries.

- Two small runtime utilities used by both scripts and available to anything else that imports this package:
  - `compileSchema`
  - `toRelativePath`

This package is `private` and consumed via `workspace:*` (see `@distkit/cli`). It's only worth publishing if external tools need to read the registry output.

The primary consumer export is `RegistrySchema`—the container shape (`name`, `version`, `baseUrl`, `items`, ...) that validates a `registry/index.json`. What `items` holds depends on your `ItemSchema` fork. Other exports (`ComponentSchema`, `UtilitySchema`, helpers, utilities) are reference material for composing custom item types.

## Layout

```text
json-schemas/                Generated JSON Schema files — see "Scripts" below, don't hand-edit
  component.json
  registry.json
  utility.json

scripts/
  generate-json-schemas.ts   Dumps the TypeBox schemas in src/ out to json-schemas/*.json
  build-registry.ts          Scans packages/registry/{components,utilities}/*.json, writes packages/registry/index.json

src/
  helpers/
    $schema.ts                 $SchemaSchema - a JSON schema reference.
    base.ts                    ItemBaseSchema - $SchemaSchema + name + type, common to every item
    file.ts                    FileSchema - a single file path entry
    item.ts                    ItemSchema - union of ComponentSchema | UtilitySchema
    name.ts                    ItemNameSchema - kebab-case name pattern
    npm.ts                     NpmPackagesSchema - { [packageName]: versionRange }
    type.ts                    ItemTypeSchema - 'component' | 'utility'
  utils/
    compile-schema.ts          compileSchema() - wraps typebox/schema's Schema.Compile
    to-relative-path.ts        toRelativePath() - absolute path -> relative, for readable script logs
  component.ts                 ComponentSchema
  registry.ts                  RegistrySchema
  utility.ts                   UtilitySchema
  index.ts                     Public exports
```

## How this example is put together

Every item combines `ItemBaseSchema` (`$schema`, `name`, `type`) with item-specific fields (`files`, optional `dependencies`, and a literal `type`). `ItemSchema` is the union of available types. `RegistrySchema` expects `items: ItemSchema[]` without caring what's in the union.

> Swap `ItemSchema` for a union of your own item types and `RegistrySchema` keeps working unchanged.

One deliberate asymmetry worth knowing about:

- A **component**'s `dependencies` can list other `components`, `utilities`, and `npmPackages`.
- A **utility**'s `dependencies` can only list other `utilities` and `npmPackages`—never `components`.

This keeps utilities beneath components in the dependency graph instead of letting the two depend on each other circularly.

## Exports

Exports include reusable container pieces (`RegistrySchema`, helpers) and this registry's item types (`ComponentSchema`, `UtilitySchema`). Replace component/utility with your own types and the table changes accordingly.

| Export | Kind | Description |
| --- | --- | --- |
| `$SchemaSchema` / `$Schema` | schema / type | A JSON schema reference. |
| `ItemBaseSchema` / `ItemBase` | schema / type | Common shape every item has: `$schema`, `name`, `type` |
| `FileSchema` / `File` | schema / type | A single file path, relative to the registry's `baseUrl` |
| `ItemNameSchema` / `ItemName` | schema / type | Kebab-case name pattern (`^[a-z][a-z0-9-]*$`) |
| `ItemTypeSchema` / `ItemType` | schema / type | `'component' \| 'utility'` |
| `NpmPackagesSchema` / `NpmPackages` | schema / type | `{ [packageName]: versionRange }` |
| `ItemSchema` / `Item` | schema / type | Union of `ComponentSchema \| UtilitySchema` |
| `ComponentSchema` / `Component` | schema / type | A registry component item |
| `UtilitySchema` / `Utility` | schema / type | A registry utility item |
| `RegistrySchema` / `Registry` | schema / type | The full registry document |
| `compileSchema()` | function | Compiles a TypeBox schema into a validator via `typebox/schema`'s `Schema.Compile` |
| `toRelativePath()` | function | Absolute path → relative, used for readable script logs |

`RegistrySchema` is the primary one — validating a registry's `index.json` is the only thing a plain consumer needs. The rest are exported for reference, in case someone wants to build their own item types or validation on top of the same spec.

## Usage

```ts
import { compileSchema, type Component, ComponentSchema } from '@distkit/schema'

const validator = compileSchema(ComponentSchema)

// throws if the object doesn't match ComponentSchema; otherwise returns it typed as Component
const component: Component = validator.Parse(candidateEntry)
```

This is exactly what `scripts/build-registry.ts` does with `RegistrySchema` before writing `registry/index.json` — compile the schema once, then call `.Parse()` on the complete registry.

## Scripts

**`pnpm generate:json-schemas`** — runs `scripts/generate-json-schemas.ts`. Writes `ComponentSchema`, `RegistrySchema`, and `UtilitySchema` straight out to `json-schemas/*.json`. Since TypeBox schemas are already JSON-Schema-shaped objects, this is a dump, not a transform—re-run it any time `src/` changes.

**`pnpm build:registry`** — runs `scripts/build-registry.ts`. Scans `packages/registry/components/*.json` and `packages/registry/utilities/*.json` for hand-authored item entries, validates each against `ItemSchema`, resolves the registry's own top-level dependencies, and writes the result to `packages/registry/index.json`. The `baseUrl` it stamps onto the built registry points at a GitHub raw-content URL pinned to this package's version tag—no separate hosting, a git tag is the deploy.

Two things in this script are currently hardcoded rather than derived from the item entries—the first place to look if your registry's shared dependencies end up different from this one's:

- `registryNpmDependenciesKeys` — npm packages the registry itself depends on (currently just `ofetch`), read out of the `vendor` catalog in the root `pnpm-workspace.yaml`.
- `dependencies.utilities` — utilities every item in the registry is assumed to need (currently `['styling']`).

## Adding a new item type

This registry ships `component` and `utility` as example item types, not a requirement. Replace both if your distribution needs different types—the steps are identical.

To add or swap in a type—say, `template`:

1. Add the new literal to the union in `src/helpers/type.ts`.
2. Create `src/template.ts`, mirroring `src/component.ts`: `Type.Intersect([ItemBaseSchema, Type.Object({ ...fields, type: Type.Literal('template') })])`.
3. Add `TemplateSchema` to the union in `src/helpers/item.ts`.
4. Export it from `src/index.ts`.
5. Run `pnpm generate:json-schemas` to regenerate `json-schemas/template.json` and pick up the wider `items` union in `json-schemas/registry.json`.
6. Add a `packages/registry/templates/` folder for entries, and extend the glob pattern in `scripts/build-registry.ts` to include `templates/*.json`.

## License

MIT