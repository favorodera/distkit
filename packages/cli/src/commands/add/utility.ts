import { intro, spinner, tasks } from '@clack/prompts'
import { compileSchema, RegistrySchema } from '@distkit/schema'
import { defineCommand } from 'citty'
import type { ResolvedRegistryItem } from '../../types'
import { loadUserConfig } from '../../utils/config'
import { commonArgs } from '../../utils/constants'
import { confirmItemsFilesOverwrite } from '../../utils/file-system'
import { fetchRegistry, installRegistryItems, resolveRegistryItems, resolveRegistryNameToSource } from '../../utils/registry'

/**
 * Add utility command.
 * @returns The command definition.
 */
export function utility() {
  return defineCommand({
    args: {
      registry: commonArgs.registry,
    },
    meta: {
      description: 'Add utility(ies) to the project',
      name: 'utility',
    },
    async run({ args }) {
      intro('Adding utility(ies)')

      const utilities = args._

      if (utilities.length === 0) {
        throw new Error('No utilities specified. Usage: distkit add utility <utility...>')
      }

      const spin = spinner({
        cancelMessage: 'Cancelled.',
        errorMessage: 'Failed.',
      })

      spin.start('Loading config')
      const userConfig = await loadUserConfig()
      spin.stop('Config loaded')

      spin.start('Resolving registry name to source')
      const registrySource = resolveRegistryNameToSource(args.registry, userConfig)
      spin.stop('Registry name resolved to source')

      spin.start('Compiling registry schema')
      const compiledRegistrySchema = compileSchema(RegistrySchema)
      spin.stop('Registry schema compiled')

      spin.start('Fetching registry')
      const rawRegistry = await fetchRegistry(registrySource)
      spin.stop('Registry fetched successfully')

      spin.start('Parsing and validating registry')
      const registry = compiledRegistrySchema.Parse(rawRegistry)
      spin.stop('Registry parsed and validated')

      spin.start('Resolving registry items')
      const rawUtilities = utilities.map(name => ({
        name,
        type: 'utility' as const,
      }))
      const resolvedItems = resolveRegistryItems(rawUtilities, registry)

      const itemsToInstall: Array<ResolvedRegistryItem> = resolvedItems.values().toArray()
      spin.stop('Resolved registry items')

      const shouldWriteChoices = await confirmItemsFilesOverwrite(itemsToInstall, userConfig)

      await tasks([
        {
          enabled: itemsToInstall.length > 0,
          async task(message) {
            await installRegistryItems(
              itemsToInstall,
              registry,
              userConfig,
              shouldWriteChoices,
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
