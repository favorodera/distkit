import { type Static, Type } from 'typebox'

export const FileSchema = Type.String({
  description: 'Path to a file of a file based item, relative to the registry base URL.',
  examples: ['components/button/button.vue', 'utilities/styling.ts'],
  minLength: 1,
})

export type File = Static<typeof FileSchema>
