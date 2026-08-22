import { type Static, Type } from 'typebox'
import { ItemBaseSchema } from './helpers/base'
import { FileSchema } from './helpers/file'
import { ItemNameSchema } from './helpers/name'
import { NpmPackagesSchema } from './helpers/npm'

const ComponentDependenciesSchema = Type.Object({
  components: Type.Optional(Type.Array(ItemNameSchema, {
    description: 'Components this component depends on.',
    minItems: 1,
    uniqueItems: true,
  })),
  npmPackages: Type.Optional(NpmPackagesSchema),
  utilities: Type.Optional(Type.Array(ItemNameSchema, {
    description: 'Utilities this component depends on.',
    minItems: 1,
    uniqueItems: true,
  })),
}, {
  description: 'Component, utility, and/or npm package dependencies this component may have.',
})

export const ComponentSchema = Type.Intersect(
  [
    ItemBaseSchema,
    Type.Object({
      dependencies: Type.Optional(ComponentDependenciesSchema),
      files: Type.Array(FileSchema, {
        description: 'Files that make up the component.',
        minItems: 1,
        uniqueItems: true,
      }),
      type: Type.Literal('component'),
    }),
  ],
  {
    description: 'A registry component item.',
  },
)

export type Component = Static<typeof ComponentSchema>
