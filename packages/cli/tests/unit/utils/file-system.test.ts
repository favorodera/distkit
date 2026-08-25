import type { Item } from '@distkit/schema'
import { join } from 'pathe'
import { describe, expect, it } from 'vitest'
import { resolveItemFileInstallPath, resolveItemInstallDir } from '../../../src/utils/file-system'
import { mockUserConfig } from '../../utils'

describe('resolveItemInstallDir', () => {
  it('returns components.dir for component', () => {
    expect(resolveItemInstallDir('component', mockUserConfig)).toBe('src/components')
  })

  it('returns utils.dir for utility', () => {
    expect(resolveItemInstallDir('utility', mockUserConfig)).toBe('src/utils')
  })

  it('throws for unsupported types', () => {
    expect(() => resolveItemInstallDir('template' as 'component', mockUserConfig))
      .toThrow('Cannot resolve install directory for "template"')
  })
})

describe('resolveItemFileInstallPath', () => {
  const cwd = process.cwd()

  it('installs components into a named subdirectory', () => {
    const item: Item = {
      files: ['components/button/button.vue'],
      name: 'button',
      type: 'component',
    }

    const input = resolveItemFileInstallPath(
      item,
      'components/button/button.vue',
      mockUserConfig,
    )

    const expected = join(cwd, 'src/components', 'button', 'button.vue')

    expect(input).toBe(expected)
  })

  it('installs utilities as flat files', () => {
    const item: Item = {
      files: ['utils/styling.ts'],
      name: 'styling',
      type: 'utility',
    }

    const input = resolveItemFileInstallPath(
      item,
      'utils/styling.ts',
      mockUserConfig,
    )

    const expected = join(cwd, 'src/utils', 'styling.ts')

    expect(input).toBe(expected)
  })

  it('uses only the basename of the registry file path', () => {
    const item: Item = {
      files: ['components/icon/utils.ts'],
      name: 'icon',
      type: 'component',
    }

    const input = resolveItemFileInstallPath(
      item,
      'components/icon/utils.ts',
      mockUserConfig,
    )

    const expected = join(cwd, 'src/components', 'icon', 'utils.ts')

    expect(input).toBe(expected)
  })
})
