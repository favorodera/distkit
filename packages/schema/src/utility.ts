import { type Static, Type } from 'typebox'
import { ItemBaseSchema } from './helpers/base'
import { FileSchema } from './helpers/file'
import { ItemNameSchema } from './helpers/name'
import { NpmPackagesSchema } from './helpers/npm'

const UtilityDependenciesSchema = Type.Object({
  npmPackages: Type.Optional(NpmPackagesSchema),
  utilities: Type.Optional(Type.Array(ItemNameSchema, {
    description: 'Utilities this utility depends on.',
    minItems: 1,
    uniqueItems: true,
  })),
}, {
  description: 'Utility and/or npm package dependencies this utility may have.',
})

export const UtilitySchema = Type.Intersect(
  [
    ItemBaseSchema,
    Type.Object({
      dependencies: Type.Optional(UtilityDependenciesSchema),
      files: Type.Array(FileSchema, {
        description: 'Files that make up the utility.',
        minItems: 1,
        uniqueItems: true,
      }),
      type: Type.Literal('utility'),
    }),
  ],
  {
    description: 'A registry utility item.',
  },
)

export type Utility = Static<typeof UtilitySchema>
