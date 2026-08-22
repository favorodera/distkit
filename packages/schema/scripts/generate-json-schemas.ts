import { fileURLToPath } from 'node:url'
import { dirname, join } from 'pathe'
import {
  ComponentSchema,
  generateJSONSchemas,
  RegistrySchema,
  type TSSchemaEntry,
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
const schemas: Array<TSSchemaEntry> = [
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

await generateJSONSchemas(schemas)
