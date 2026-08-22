import { type Static, Type } from 'typebox'
import { ComponentSchema } from '../component'
import { UtilitySchema } from '../utility'

export const ItemSchema = Type.Union([
  ComponentSchema,
  UtilitySchema,
], {
  description: 'Possible item in the registry.',
})

export type Item = Static<typeof ItemSchema>
