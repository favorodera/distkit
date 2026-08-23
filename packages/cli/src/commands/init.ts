import { cancel, group, intro, spinner, text } from '@clack/prompts'
import { compileSchema, type Registry, RegistrySchema } from '@distkit/schema'
import { defineCommand } from 'citty'
import { join } from 'pathe'
import type { UserConfig } from '../types'
import { defaultRegistryIndexUrl, defaultRegistryName, userConfigFileName } from '../utils/constants'
import { confirmPathOverwrite } from '../utils/file-system'
import { fetchRegistry, resolveRegistryNameToSource } from '../utils/registry'

/**
 * Initializes DistKit in the current project.
 * @returns The command definition.
 */
export async function init() {
  return defineCommand({
    meta: {
      description: 'Initialize DistKit in your project',
      name: 'init',
    },
    async run() {
      intro('Initializing DistKit')

      const spin = spinner({
        cancelMessage: 'Operation cancelled',
        errorMessage: 'Operation failed',
      })

      const cwd = process.cwd()

      // Prompt user for config choices before any actions
      const userConfigChoices = await group({
        components: () => group({
          dir: () => text({
            initialValue: '@/components',
            message: 'Where should components be located? (relative to project root)',
            placeholder: '@/components',
          }),
          import: () => text({
            initialValue: '@/components',
            message: 'What should the import alias for components be?',
            placeholder: '@/components',
          }),
        }),

        utilities: () => group({
          dir: () => text({
            initialValue: '@/utils',
            message: 'Where should utilities be located? (relative to project root)',
            placeholder: '@/utils',
          }),
          import: () => text({
            initialValue: '@/utils',
            message: 'What should the import alias for utilities be?',
            placeholder: '@/utils',
          }),
        }),
      }, {
        onCancel: () => {
          cancel('Operation cancelled.')
          process.exit(0)
        },
      })

      // Compile user's config choices into a config object.
      const userConfig: UserConfig = {
        ...userConfigChoices,
        registries: {
          [defaultRegistryName]: defaultRegistryIndexUrl,
        },
      }

      const userConfigChoicesResolvedPaths = {
        componentsDir: join(cwd, userConfigChoices.components.dir),
        userConfig: join(cwd, userConfigFileName),
        utilitiesDir: join(cwd, userConfigChoices.utilities.dir),
      }

      // Send all overwrite prompts upfront
      const shouldWriteUserConfig = await confirmPathOverwrite(userConfigChoicesResolvedPaths.userConfig)
      const shouldWriteComponentsDir = await confirmPathOverwrite(userConfigChoicesResolvedPaths.componentsDir)
      const shouldWriteUtilitiesDir = await confirmPathOverwrite(userConfigChoicesResolvedPaths.utilitiesDir)

      spin.start('Resolving default registry name to source')
      const registrySource = resolveRegistryNameToSource(defaultRegistryName, userConfig)
      spin.stop('Default registry name resolved to source')

      spin.start('Compiling registry schema')
      const compiledRegistrySchema = compileSchema<Registry>(RegistrySchema)
      spin.stop('Registry schema compiled')

      spin.start('Fetching registry')
      const rawRegistry = await fetchRegistry(registrySource)
      spin.stop('Registry fetched successfully')

      spin.start('Parsing and validating registry')
      const registry = compiledRegistrySchema.Parse(rawRegistry)
      spin.stop('Registry parsed and validated')
    },
  })
}
