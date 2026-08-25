import { cancel, group, intro, spinner, tasks, text } from '@clack/prompts'
import { compileSchema, RegistrySchema } from '@distkit/schema'
import { defineCommand } from 'citty'
import fsExtra from 'fs-extra/esm'
import { join } from 'pathe'
import type { GeneratedItemKey, ResolvedRegistryItem, UserConfig } from '../types'
import { generateUserConfig } from '../utils/config'
import { defaultRegistryIndexUrl, defaultRegistryName, userConfigFileName } from '../utils/constants'
import { confirmItemsFilesOverwrite, confirmPathOverwrite, toRelativePath } from '../utils/file-system'
import { fetchRegistry, generateItemKey, installRegistryItems, resolveRegistryItems, resolveRegistryNameToSource } from '../utils/registry'

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
            initialValue: 'src/components',
            message: 'Where should components be located? (relative to project root)',
            validate(value) {
              if (!value) {
                return 'Components directory is required.'
              }
            },
          }),
          import: () => text({
            initialValue: '@/components',
            message: 'What should the import alias for components be?',
            validate(value) {
              if (!value) {
                return 'Components import alias is required.'
              }
            },
          }),
        }),

        utilities: () => group({
          dir: () => text({
            initialValue: 'src/utils',
            message: 'Where should utilities be located? (relative to project root)',
            validate(value) {
              if (!value) {
                return 'Utilities directory is required.'
              }
            },
          }),
          import: () => text({
            initialValue: '@/utils',
            message: 'What should the import alias for utilities be?',
            validate(value) {
              if (!value) {
                return 'Utilities import alias is required.'
              }
            },
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
        components: userConfigChoices.components,
        registries: {
          [defaultRegistryName]: defaultRegistryIndexUrl,
        },
        utilities: userConfigChoices.utilities,
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
      const compiledRegistrySchema = compileSchema(RegistrySchema)
      spin.stop('Registry schema compiled')

      spin.start('Fetching registry')
      const rawRegistry = await fetchRegistry(registrySource)
      spin.stop('Registry fetched successfully')

      spin.start('Parsing and validating registry')
      const registry = compiledRegistrySchema.Parse(rawRegistry)
      spin.stop('Registry parsed and validated')

      spin.start('Resolving registry dependencies')
      spin.message('Resolving utilities dependencies')
      const rawUtilities = (registry?.dependencies?.utilities || []).map(name => ({
        name,
        type: 'utility' as const,
      }))
      const resolvedUtilities = resolveRegistryItems(rawUtilities, registry)
      spin.message('Resolved utilities dependencies')

      spin.message('Resolving npm packages dependencies')
      const rawNpmPackages = Object.entries(registry?.dependencies?.npmPackages || {})
      const resolvedNpmPackages = new Map<GeneratedItemKey, ResolvedRegistryItem>()

      for (const [name, version] of rawNpmPackages) {
        const npmPackageKey = generateItemKey('npmPackage', name)
        resolvedNpmPackages.set(npmPackageKey, {
          name,
          type: 'npmPackage' as const,
          version,
        })
      }
      spin.message('Resolved npm packages dependencies')

      const itemsToInstall: Array<ResolvedRegistryItem> = [...resolvedUtilities.values(), ...resolvedNpmPackages.values()]
      spin.stop(`Resolved registry dependencies`)

      const registryDependenciesShouldWriteChoices = await confirmItemsFilesOverwrite(resolvedUtilities.values(), userConfig)

      await tasks([
        {
          enabled: shouldWriteUserConfig,
          async task(message) {
            message('Generating config from choices')
            const configContent = generateUserConfig(userConfig)

            message('Writing config to disk')
            await fsExtra.outputFile(userConfigChoicesResolvedPaths.userConfig, configContent)

            return `User config created at ${toRelativePath(userConfigChoicesResolvedPaths.userConfig)}`
          },
          title: 'Creating user config',
        },

        {
          enabled: shouldWriteComponentsDir,
          async task() {
            await fsExtra.ensureDir(userConfigChoicesResolvedPaths.componentsDir)

            return `Components directory created at ${toRelativePath(userConfigChoicesResolvedPaths.componentsDir)}`
          },
          title: 'Creating components directory',
        },

        {
          enabled: shouldWriteUtilitiesDir,
          async task() {
            await fsExtra.ensureDir(userConfigChoicesResolvedPaths.utilitiesDir)

            return `Utilities directory created at ${toRelativePath(userConfigChoicesResolvedPaths.utilitiesDir)}`
          },
          title: 'Creating utilities directory',
        },

        {
          async task(message) {
            await installRegistryItems(
              itemsToInstall,
              registry,
              userConfig,
              registryDependenciesShouldWriteChoices,
              message,
            )

            return `Registry items installed successfully`
          },
          title: 'Installing registry items',
        },

      ])
    },
  })
}
