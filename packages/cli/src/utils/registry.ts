import type { Item, ItemBase, ItemType, Registry } from '@distkit/schema'
import fsExtra from 'fs-extra'
import { basename } from 'pathe'
import type { GeneratedItemKey, ResolvedRegistryItem, UserConfig } from '../types'
import { resolveItemFileInstallPath } from './file-system'
import { rewriteImports } from './imports'
import { jsonFetch, textFetch } from './network'
import { installNpmPackage } from './npm'

/**
 * Resolves a registry name to its source from the user config.
 * @param name The name of the registry to resolve.
 * @param config The user config containing the registry mappings.
 * @returns An object containing the registry name and its index URL.
 * @throws If the registry name is not found in the config.
 */
export function resolveRegistryNameToSource(name: string, config: UserConfig) {
  const registryIndexUrl = config.registries[name]

  if (!registryIndexUrl) {
    throw new Error(`Registry ${name} not found. Please add it to your config`)
  }

  return { indexUrl: registryIndexUrl, name }
}

/**
 * Fetches a registry from its index URL.
 * @param source The resolved registry source.
 * @returns The fetched registry.
 * @throws If the registry fetch fails.
 */
export async function fetchRegistry(source: ReturnType<typeof resolveRegistryNameToSource>) {
  try {
    const registry = await jsonFetch<Registry>(source.indexUrl)

    return registry
  } catch (error) {
    throw new Error(`Failed to fetch registry ${source.name}`, { cause: error })
  }
}

/**
 * Generates a unique key for an item or npm package based on its type and name.
 * @param type The type of the item or npm package.
 * @param name The name of the item or npm package.
 * @returns The unique key for the item or npm package.
 */
export function generateItemKey(type: 'npmPackage' | ItemType, name: string): GeneratedItemKey {
  return `${type}:${name}`
}

/**
 * Recursively resolves an item and its transitive dependencies.
 * @internal
 * @param referenceItem Item to resolve.
 * @param registryItemsMap Map of all registry items.
 * @param resolvedRegistryItems Map to store resolved items.
 * @param visitedItemsKeys Set to track visited item keys.
 */
function resolveRegistryItem(
  referenceItem: Pick<ItemBase, 'name' | 'type'>,
  registryItemsMap: Map<string, Item>,
  resolvedRegistryItems: Map<GeneratedItemKey, ResolvedRegistryItem>,
  visitedItemsKeys: Set<GeneratedItemKey>,
) {
  const itemKey = generateItemKey(referenceItem.type, referenceItem.name)

  // Prevent infinite loops check if item already visited
  if (visitedItemsKeys.has(itemKey)) {
    return
  }

  // Mark the item as visited
  visitedItemsKeys.add(itemKey)

  // Retrieve the full item definition from our registry map
  const item = registryItemsMap.get(itemKey)

  if (!item) {
    throw new Error(`Item ${referenceItem.name} of type ${referenceItem.type} not found in registry`)
  }

  // Add the items to the resolved items
  resolvedRegistryItems.set(itemKey, item)

  // Recurse over the item's dependencies if it has any, iterate and add dependencies to the resolved items
  if ('dependencies' in item && item.dependencies) {
    // Check for npm packages
    if (item.dependencies.npmPackages) {
      const npmPackagesEntries = Object.entries(item.dependencies.npmPackages)

      for (const [npmPackageName, npmPackageVersion] of npmPackagesEntries) {
        const npmPackageKey = generateItemKey('npmPackage', npmPackageName)

        resolvedRegistryItems.set(npmPackageKey, {
          name: npmPackageName,
          type: 'npmPackage',
          version: npmPackageVersion,
        })
      }
    }

    if ('components' in item.dependencies && item.dependencies.components) {
      for (const componentName of item.dependencies.components) {
        resolveRegistryItem(
          { name: componentName, type: 'component' },
          registryItemsMap,
          resolvedRegistryItems,
          visitedItemsKeys,
        )
      }
    }

    if ('utilities' in item.dependencies && item.dependencies.utilities) {
      for (const utilityName of item.dependencies.utilities) {
        resolveRegistryItem(
          { name: utilityName, type: 'utility' },
          registryItemsMap,
          resolvedRegistryItems,
          visitedItemsKeys,
        )
      }
    }
  }
}

/**
 * Resolves a list of registry items and their transitive dependencies.
 * @param items Items to resolve.
 * @param registry The registry containing the items.
 * @returns A map of resolved items including their transitive dependencies.
 */
export function resolveRegistryItems(items: Array<Pick<ItemBase, 'name' | 'type'>>, registry: Registry) {
  const resolvedRegistryItems = new Map<GeneratedItemKey, ResolvedRegistryItem>()

  // Build a flat lookup map for efficient resolution
  const itemsMap = new Map<GeneratedItemKey, Item>()
  for (const item of registry.items) {
    const itemKey = generateItemKey(item.type, item.name)
    itemsMap.set(itemKey, item)
  }

  // Track visited items to prevent infinite loops
  const visitedItemsKeys = new Set<GeneratedItemKey>()

  // Process each item and its dependencies
  for (const item of items) {
    resolveRegistryItem(item, itemsMap, resolvedRegistryItems, visitedItemsKeys)
  }

  return resolvedRegistryItems
}

/**
 * Installs a registry item and its dependencies.
 * @internal
 * @param item Item to install.
 * @param registry Registry containing the item.
 * @param config User config.
 * @param shouldWriteChoicesMap Map of user choices wether to install a specific file(if file based item).
 * @param message Message function.
 */
async function installRegistryItem(
  item: ResolvedRegistryItem,
  registry: Registry,
  config: UserConfig,
  shouldWriteChoicesMap: Map<string, boolean>,
  message: (message: string) => void,
) {
  const itemKey = generateItemKey(item.type, item.name)

  message(`Installing item "${itemKey}"`)

  switch (item.type) {
    case 'component':
    case 'utility': {
      for (const file of item.files) {
        const installPath = resolveItemFileInstallPath(item, file, config)
        const fetchUrl = new URL(file, registry.baseUrl).href

        if (shouldWriteChoicesMap.get(installPath)) {
          try {
            message(`Fetching file "${basename(file)}" of item "${itemKey}"`)
            const rawFileContent = await textFetch(fetchUrl)
            message(`File "${basename(file)}" of item "${itemKey}" fetched successfully`)

            message(`Rewriting imports for file "${basename(file)}" of item "${itemKey}"`)
            const processedFileContent = rewriteImports(rawFileContent, config)
            message(`Imports rewritten successfully for file "${basename(file)}" of item "${itemKey}"`)

            message(`Writing file "${basename(file)}" of item "${itemKey}" to "${installPath}"`)
            await fsExtra.outputFile(installPath, processedFileContent)
            message(`File "${basename(file)}" of item "${itemKey}" written successfully`)
          } catch (error) {
            throw new Error(
              `Failed to install file "${basename(file)}" of item "${itemKey}"`,
              { cause: error },
            )
          }
        }
      }

      break
    }

    case 'npmPackage': {
      const npmPackageNameVersion = `${item.name}@${item.version}`

      try {
        message(`Installing npm package "${npmPackageNameVersion}"`)
        await installNpmPackage(item.name, item.version)
        message(`Successfully installed npm package "${npmPackageNameVersion}"`)
      } catch (error) {
        throw new Error(
          `Failed to install npm package "${npmPackageNameVersion}"`,
          { cause: error },
        )
      }
    }
  }
}

/**
 * Installs multiple registry items.
 * @param items Items to install.
 * @param registry Registry containing the items.
 * @param config User config.
 * @param shouldWriteChoicesMap Map of user choices wether to install a specific file(if file based item).
 * @param message Message function.
 */
export async function installRegistryItems(
  items: Array<ResolvedRegistryItem>,
  registry: Registry,
  config: UserConfig,
  shouldWriteChoicesMap: Map<string, boolean>,
  message: (message: string) => void,
) {
  for (const item of items) {
    await installRegistryItem(
      item,
      registry,
      config,
      shouldWriteChoicesMap,
      message,
    )
  }
}
