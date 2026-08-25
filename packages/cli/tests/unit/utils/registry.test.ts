import { describe, expect, it } from 'vitest'
import { resolveRegistryItems, resolveRegistryNameToSource } from '../../../src/utils/registry'
import { getRegistryItem, mockRegistry, mockUserConfig } from '../../utils'

describe('resolveRegistryNameToSource', () => {
  it('resolves a configured registry entry', () => {
    const registryKey = Object.keys(mockUserConfig.registries)[0]
    const source = resolveRegistryNameToSource(registryKey, mockUserConfig)

    expect(source).toStrictEqual({
      indexUrl: mockUserConfig.registries[registryKey as keyof typeof mockUserConfig.registries],
      name: registryKey,
    })
  })

  it('throws when registry is not configured', () => {
    expect(() => resolveRegistryNameToSource('missing', mockUserConfig))
      .toThrow('Registry "missing" not found. Please add it to your config')
  })
})

describe('resolveRegistryItems', () => {
  it('resolves a single component with no deps', () => {
    const button = getRegistryItem('button', 'component')

    const result = resolveRegistryItems(
      [
        {
          name: 'button',
          type: 'component',
        },
      ],
      mockRegistry,
    )

    expect(result.size).toBe(1)
    expect(result.get('component:button')).toStrictEqual(button)
  })

  it('collects package dependencies', () => {
    const icon = getRegistryItem('icon', 'component')

    const result = resolveRegistryItems(
      [
        {
          name: 'icon',
          type: 'component',
        },
      ],
      mockRegistry,
    )

    expect(result.get('component:icon')).toStrictEqual(icon)
    expect(result.get('npmPackage:@iconify/vue')).toStrictEqual({
      name: '@iconify/vue',
      type: 'npmPackage',
      version: '^5.0.1',
    })
  })

  it('resolves transitive component dependencies', () => {
    const icon = getRegistryItem('icon', 'component')
    const proseCodeIcon = getRegistryItem('prose-code-icon', 'component')

    const result = resolveRegistryItems(
      [
        {
          name: 'prose-code-icon',
          type: 'component',
        },
      ],
      mockRegistry,
    )

    expect(result.get('component:prose-code-icon')).toStrictEqual(proseCodeIcon)
    expect(result.get('component:icon')).toStrictEqual(icon)
    expect(result.get('npmPackage:@iconify/vue')).toStrictEqual({
      name: '@iconify/vue',
      type: 'npmPackage',
      version: '^5.0.1',
    })
  })

  it('resolves deep dependency trees without duplicates', () => {
    const result = resolveRegistryItems(
      [
        {
          name: 'prose-pre',
          type: 'component',
        },
      ],
      mockRegistry,
    )

    const expectedKeys = [
      'component:prose-pre',
      'component:prose-code-icon',
      'component:icon',
      'component:button',
      'npmPackage:@iconify/vue',
    ].toSorted((keyA, keyB) => keyA.localeCompare(keyB))

    // eslint-disable-next-line unicorn/prefer-iterator-to-array
    const actualKeys = [...result.keys()].toSorted((keyA, keyB) => keyA.localeCompare(keyB))

    expect(actualKeys).toStrictEqual(expectedKeys)
  })

  it('resolves utility dependency chains', () => {
    const props = getRegistryItem('props', 'utility')
    const styling = getRegistryItem('styling', 'utility')

    const result = resolveRegistryItems(
      [
        {
          name: 'styling',
          type: 'utility',
        },
      ],
      mockRegistry,
    )

    expect(result.size).toBe(2)
    expect(result.get('utility:styling')).toStrictEqual(styling)
    expect(result.get('utility:props')).toStrictEqual(props)
  })

  it('resolves multiple root items', () => {
    const button = getRegistryItem('button', 'component')
    const props = getRegistryItem('props', 'utility')
    const styling = getRegistryItem('styling', 'utility')

    const result = resolveRegistryItems(
      [
        {
          name: 'button',
          type: 'component',
        },
        {
          name: 'styling',
          type: 'utility',
        },
      ],
      mockRegistry,
    )

    expect(result.get('component:button')).toStrictEqual(button)
    expect(result.get('utility:styling')).toStrictEqual(styling)
    expect(result.get('utility:props')).toStrictEqual(props)
  })

  it('throws when item is not in the registry', () => {
    expect(() => resolveRegistryItems(
      [
        {
          name: 'missing',
          type: 'component',
        },
      ],
      mockRegistry,
    )).toThrow('Item "missing" of type "component" not found in registry')
  })
})

