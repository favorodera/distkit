import { type Static, Type } from 'typebox'

export const NpmPackagesSchema = Type.Record(
  Type.String({ description: 'NPM package name.' }),
  Type.String({ description: 'NPM package version range.' }),
  {
    description: 'Installable npm packages.',
    minProperties: 1,
  },
)

export type NpmPackages = Static<typeof NpmPackagesSchema>
