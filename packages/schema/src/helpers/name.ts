import { type Static, Type } from 'typebox'

export const ItemNameSchema = Type.String({
  description: 'Unique kebab-case name of an item within the registry.',
  examples: ['input-with-dropdown', 'style-picker'],
  minLength: 1,
  pattern: '^[a-z][a-z0-9-]*$',
})

export type ItemName = Static<typeof ItemNameSchema>
