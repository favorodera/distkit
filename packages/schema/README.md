<div align="center"> 
  <h1><code>@distkit/schema</code></h1> 

  <p> 
    TypeBox schemas, JSON Schema generation, and registry-building utilities for distkit.
  </p> 
</div>

This package defines the shape of registries and registry items using [TypeBox](https://sinclairzx81.github.io/typebox/#/). Schemas are compiled into validators at runtime and can be exported as standard JSON Schema files for editor support (via `$schema`).

## Schemas

### Core schemas

| Schema | Description |
|---|---|
| `RegistrySchema` | The full registry: name, version, baseUrl, items, and optional dependencies |
| `ComponentSchema` | A registry component item with files and dependencies on components, utilities, and npm packages |
| `UtilitySchema` | A registry utility item with files and dependencies on utilities and npm packages |

### Helper schemas

| Schema | Description |
|---|---|
| `ItemBaseSchema` | Common properties every item has: `$schema`, `name`, `type` |
| `ItemSchema` | Union of `ComponentSchema` and `UtilitySchema` |
| `ItemNameSchema` | Validated item name (lowercase, kebab-case) |
| `ItemTypeSchema` | Enum of valid item types |
| `FileSchema` | File path reference |
| `NpmPackagesSchema` | Map of npm package names to version ranges |
| `$SchemaSchema` | Optional `$schema` field for JSON Schema editor support |

## Exports

```ts
// Helper schemas
export * from './helpers/$schema'
export * from './helpers/base'
export * from './helpers/file'
export * from './helpers/item'
export * from './helpers/name'
export * from './helpers/npm'
export * from './helpers/type'

// Core schemas
export * from './component'
export * from './registry'
export * from './utility'

// Utils
export * from './utils/compile-schema'
```

All schemas export both the TypeBox schema object and a `Static<typeof ...>` TypeScript type.

## Validation

Use `compileSchema` to create a validator from any schema:

```ts
import { compileSchema, RegistrySchema } from '@distkit/schema'

const validate = compileSchema(RegistrySchema)
const registry = validate.Parse(rawData) // throws on invalid data
```

## Extending with a new item type

To add a new item type (for example, a `template`):

1. Create `src/template.ts` following the pattern in `component.ts` or `utility.ts`:
   - Define a dependencies schema if needed.
   - Intersect `ItemBaseSchema` with your type-specific fields.
   - Export the schema and its `Static` type.

2. Add the new type to `ItemTypeSchema` in `src/helpers/type.ts`.

3. Add the new schema to the `ItemSchema` union in `src/helpers/item.ts`.

4. Re-export from `src/index.ts`.

5. Run `pnpm --filter='@distkit/schema' generate:json-schemas` to regenerate JSON Schema files.

## Scripts

| Script | Description |
|---|---|
| `generate:json-schemas` | Generates JSON Schema files from TypeBox schemas (for `$schema` editor support) |
| `build:registry` | Builds the registry `index.json` by scanning and validating items |

## Source layout

```text
src/
  helpers/
    $schema.ts      $schema field helper
    base.ts         ItemBaseSchema (shared item properties)
    file.ts         FileSchema
    item.ts         ItemSchema (union of all item types)
    name.ts         ItemNameSchema
    npm.ts          NpmPackagesSchema
    type.ts         ItemTypeSchema
  utils/
    compile-schema.ts   Schema compilation utility
  component.ts     ComponentSchema
  registry.ts      RegistrySchema
  utility.ts       UtilitySchema
  index.ts         Package entry point
```