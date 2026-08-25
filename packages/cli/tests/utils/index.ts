import type { ItemType, Registry } from '@distkit/schema'
import type { UserConfig } from '../../src/types'

/** Represents a mock user config for testing purposes. */
export const mockUserConfig = {
  components: {
    dir: 'src/components',
    import: '@/components',
  },
  registries: {
    distkit: 'https://example.com/index.json',
  },
  utilities: {
    dir: 'src/utils',
    import: '@/utils',
  },
} as const satisfies UserConfig

/** Represents a mock registry for testing purposes. */
export const mockRegistry = {
  baseUrl: 'https://example.com/',
  items: [
    {
      files: ['components/button/button.vue'],
      name: 'button',
      type: 'component',
    },
    {
      dependencies: {
        npmPackages: {
          '@iconify/vue': '^5.0.1',
        },
      },
      files: ['components/icon/icon.vue'],
      name: 'icon',
      type: 'component',
    },
    {
      dependencies: {
        components: ['icon'],
      },
      files: ['components/prose-code-icon/prose-code-icon.vue'],
      name: 'prose-code-icon',
      type: 'component',
    },
    {
      dependencies: {
        components: [
          'icon',
          'prose-code-icon',
          'button',
        ],
      },
      files: ['components/prose-pre/prose-pre.vue'],
      name: 'prose-pre',
      type: 'component',
    },
    {
      dependencies: {
        utilities: ['props'],
      },
      files: ['utils/styling.ts'],
      name: 'styling',
      type: 'utility',
    },
    {
      files: ['utils/props.ts'],
      name: 'props',
      type: 'utility',
    },
  ],
  name: 'nka',
  version: '0.0.0',
} as const satisfies Registry

/**
 * Gets a registry item by name and type.
 * @param name The name of the registry item to resolve from `mockRegistry.items`
 * @param type The type of the registry item to resolve from `mockRegistry.items`
 * @returns The registry item.
 */
export function getRegistryItem(name: typeof mockRegistry.items[number]['name'], type: ItemType) {
  return mockRegistry.items.find(item => item.name === name && item.type === type)
}
