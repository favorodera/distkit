import { intro, note, outro, spinner, type Task, tasks } from '@clack/prompts'
import fsExtra from 'fs-extra'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'pathe'
import {
  ComponentSchema,
  RegistrySchema,
  toRelativePath,
  UtilitySchema,
} from '../src'

const __dirname = dirname(fileURLToPath(import.meta.url))

const baseUrl = join(__dirname, '..', 'json-schemas')

/**
 * Resolves the JSON schema file path.
 * @param name The name of the JSON schema file without the extension.
 * @returns The JSON schema file path.
 */
function resolveJsonSchemaPath(name: string) {
  return join(baseUrl, `${name}.json`)
}

/** Array of JSON schema entries. */
const TSSchemasEntries = [
  {
    jsonSchemaFilePath: resolveJsonSchemaPath('component'),
    tsSchema: ComponentSchema,
  },
  {
    jsonSchemaFilePath: resolveJsonSchemaPath('registry'),
    tsSchema: RegistrySchema,
  },
  {
    jsonSchemaFilePath: resolveJsonSchemaPath('utility'),
    tsSchema: UtilitySchema,
  },
]

intro('Generating JSON schemas')

const spin = spinner({
  cancelMessage: 'Operation cancelled',
  errorMessage: 'Operation failed',
})

spin.start('Preparing JSON schemas generation tasks')
const generationTasks = new Set<Task>()

for (const TSSchemaEntry of TSSchemasEntries) {
  generationTasks.add({
    async task() {
      await fsExtra.outputJSON(
        TSSchemaEntry.jsonSchemaFilePath,
        TSSchemaEntry.tsSchema,
        { spaces: 2 },
      )

      return `"${toRelativePath(TSSchemaEntry.jsonSchemaFilePath)}" schema generated`
    },
    title: `Generating "${toRelativePath(TSSchemaEntry.jsonSchemaFilePath)}"`,
  })
}
spin.stop('JSON schemas generation tasks prepared')

await tasks([...generationTasks])

note(
  TSSchemasEntries.map(TSSchemaEntry => toRelativePath(TSSchemaEntry.jsonSchemaFilePath)).join('\n'),
  `${TSSchemasEntries.length} JSON schemas generated`,
)

outro('JSON schemas generated')
