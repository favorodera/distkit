import { type Static, Type } from 'typebox'
import { $SchemaSchema } from './$schema'
import { ItemNameSchema } from './name'
import { ItemTypeSchema } from './type'

export const ItemBaseSchema = Type.Object({
  $schema: $SchemaSchema,
  name: ItemNameSchema,
  type: ItemTypeSchema,
}, {
  description: 'Common properties every registry item has',
})

export type ItemBase = Static<typeof ItemBaseSchema>
