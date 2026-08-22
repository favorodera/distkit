import type { TSchema } from 'typebox'
import { intro, note, outro, spinner, type Task, tasks } from '@clack/prompts'
import fsExtra from 'fs-extra'
import { relative } from 'pathe'

/** Interface for a TypeScript schema entry. */
export interface TSSchemaEntry {
  /** The TypeScript schema to convert. */
  tsSchema: TSchema

  /** The absolute file path to save the JSON schema to. */
  jsonSchemaFilePath: string
}

/**
 * Converts an absolute path to a relative path.
 * @param path The absolute path to convert.
 * @returns The relative path.
 */
function toRelativePath(path: string) {
  return relative(process.cwd(), path)
}

/**
 * Generates JSON schemas from TypeScript schemas.
 * @param entries Array of TypeScript schema entries to convert.
 * @throws If the JSON schemas generation fails.
 */
export async function generateJSONSchemas(entries: Array<TSSchemaEntry>) {
  intro('Generating JSON schemas')

  const spin = spinner()

  spin.start('Preparing JSON schemas generation tasks')

  const generationTasks = new Set<Task>()

  for (const entry of entries) {
    generationTasks.add({
      async task() {
        await fsExtra.outputJSON(
          entry.jsonSchemaFilePath,
          entry.tsSchema,
          { spaces: 2 },
        )

        return `${toRelativePath(entry.jsonSchemaFilePath)} schema generated`
      },
      title: `Generating ${toRelativePath(entry.jsonSchemaFilePath)}`,
    })
  }

  spin.stop('JSON schemas generation tasks prepared')

  try {
    await tasks([...generationTasks])
  } catch (error) {
    throw new Error('Failed to generate JSON schemas', { cause: error })
  }

  note(
    entries.map(entry => `  ${toRelativePath(entry.jsonSchemaFilePath)}`).join('\n'),
    `${entries.length} JSON schemas generated`,
  )

  outro('JSON schemas generated')
}
