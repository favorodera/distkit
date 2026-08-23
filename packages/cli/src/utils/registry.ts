import type { Registry } from '@distkit/schema'
import type { UserConfig } from '../types'
import { jsonFetch } from './network'

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
