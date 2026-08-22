import { type Static, Type } from 'typebox'
import { ItemNameSchema } from './name'
import { ItemTypeSchema } from './type'

export const ItemBaseSchema = Type.Object({
  $schema: Type.String({
    description: 'JSON Schema reference for the item.',
  }),
  name: ItemNameSchema,
  type: ItemTypeSchema,
}, {
  description: 'Common properties every registry item has',
})

export type ItemBase = Static<typeof ItemBaseSchema>
