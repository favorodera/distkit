import { type Static, Type } from 'typebox'

export const $SchemaSchema = Type.String({
  description: 'A JSON schema reference.',
  examples: [
    'https://json-schema.org/draft/2020-12/schema',
    'json-schemas/registry.json',
    'json-schemas/component.json',
    'json-schemas/utility.json',
  ],
})

export type $Schema = Static<typeof $SchemaSchema>
