import { intro, note, outro, spinner } from '@clack/prompts'
import fsExtra from 'fs-extra'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'pathe'
import { glob } from 'tinyglobby'
import { parse as parseYaml } from 'yaml'
import { version } from '../package.json'
import { compileSchema, type Registry } from '../src'
import { toRelativePath } from '../src/utils/to-relative-path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const registryDir = join(__dirname, '..', '..', 'registry')
const registryIndexJSONSchemaPath = join(__dirname, '..', 'json-schemas', 'registry.json')
const registryBuildOutputPath = join(registryDir, 'index.json')
const pnpmWorkspaceYamlPath = join(__dirname, '../../../pnpm-workspace.yaml')

intro('Building registry')

const spin = spinner({
  cancelMessage: 'Operation cancelled',
  errorMessage: 'Operation failed',
})

spin.start('Compiling registry index JSON schema')
const registryIndexJSONSchema = await fsExtra.readJson(registryIndexJSONSchemaPath, 'utf8')

const compiledRegistryIndexSchema = compileSchema<Registry>(registryIndexJSONSchema)
spin.stop('Registry index JSON schema compiled')

spin.start('Scanning for registry item entries')
const registryItemEntriesFiles = await glob(
  [
    'components/*.json',
    'utilities/*.json',
  ],
  {
    absolute: true,
    cwd: registryDir,
  },
)
spin.stop('Registry item entries scanned')

note(
  registryItemEntriesFiles.map(entry => toRelativePath(entry)).join('\n'),
  `Found ${registryItemEntriesFiles.length} registry item entries`,
)

spin.start('Compiling registry item entries')
const registryItemEntries = new Set<Registry['items'][number]>()

for (const registryItemEntryFile of registryItemEntriesFiles) {
  const registryItemEntry = await fsExtra.readJson(registryItemEntryFile, 'utf8')

  registryItemEntries.add(registryItemEntry)
}
spin.stop('Registry item entries compiled')

spin.start('Compiling registry npm dependencies')
const registryNpmDependenciesKeys = ['ofetch']

spin.message('Reading pnpm workspace')
const pnpmWorkspaceYaml = await fsExtra.readFile(pnpmWorkspaceYamlPath, 'utf8')

spin.message('Parsing pnpm workspace')
const parsedPnpmWorkspaceYaml = parseYaml(pnpmWorkspaceYaml)

spin.message('Extracting npm packages')
const pnpmWorkspaceNPMPackages = parsedPnpmWorkspaceYaml.catalogs?.vendor || {}
const registryNPMPackages = new Map<string, string>()

for (const registryNpmDependencyKey of registryNpmDependenciesKeys) {
  if (Object.hasOwn(pnpmWorkspaceNPMPackages, registryNpmDependencyKey)) {
    registryNPMPackages.set(registryNpmDependencyKey, pnpmWorkspaceNPMPackages[registryNpmDependencyKey])
  } else {
    throw new Error(`NPM package "${registryNpmDependencyKey}" not found in workspace`)
  }
}
spin.stop('Registry npm dependencies compiled')

spin.start('Compiling composite registry index')
const rawRegistry: Registry = {
  $schema: '../schema/json-schemas/registry.json',
  baseUrl: `https://raw.githubusercontent.com/favorodera/distkit/refs/tags/v${version}/`,
  dependencies: {
    npmPackages: Object.fromEntries(registryNPMPackages),
    utilities: ['styling'],
  },
  items: [...registryItemEntries],
  name: 'distkit',
  version,
}
spin.stop('Composite registry index compiled')

spin.start('Parsing and validating registry index')
const parsedAndValidatedRegistry = compiledRegistryIndexSchema.Parse(rawRegistry)
spin.stop('Registry index parsed and validated')

spin.start('Writing registry index')
await fsExtra.outputJSON(registryBuildOutputPath, parsedAndValidatedRegistry, {
  encoding: 'utf8',
  spaces: 2,
})
spin.stop(`Registry index written to "${toRelativePath(registryBuildOutputPath)}"`)

outro('Registry built')
