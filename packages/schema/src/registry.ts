import { type Static, Type } from 'typebox'
import { ItemSchema } from './helpers/item'
import { ItemNameSchema } from './helpers/name'
import { NpmPackagesSchema } from './helpers/npm'

const RegistryDependenciesSchema = Type.Object({
  npmPackages: Type.Optional(NpmPackagesSchema),
  utilities: Type.Optional(Type.Array(ItemNameSchema, {
    description: 'Utilities the registry depends on.',
    minItems: 1,
    uniqueItems: true,
  })),
}, {
  description: 'Utility and/or npm package dependencies this registry may have.',
})

export const RegistrySchema = Type.Object({
  dependencies: Type.Optional(RegistryDependenciesSchema),
  items: Type.Array(ItemSchema, {
    description: 'Items in the registry.',
    minItems: 1,
    uniqueItems: true,
  }),
  name: Type.String({
    description: 'Name of the registry.',
    examples: ['distkit', 'apple-ui'],
    pattern: '^[a-z][a-z0-9-]*$',
  }),
  version: Type.String({
    description: 'Version of the registry.',
    examples: ['0.0.1'],
  }),
}, {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: 'The full registry.',
})

export type Registry = Static<typeof RegistrySchema>
