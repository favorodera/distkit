import { type Static, Type } from 'typebox'

export const ItemTypeSchema = Type.Union([
  Type.Literal('component'),
  Type.Literal('utility'),
], {
  description: 'Possible types of an item within the registry.',
  examples: ['component', 'utility'],
})

export type ItemType = Static<typeof ItemTypeSchema>
