import { describe, expect, it } from 'vitest'
import type { UserConfig } from '../../../src/types'
import { rewriteImports } from '../../../src/utils/imports'
import { mockUserConfig } from '../../utils'

describe('rewriteImports', () => {
  it('rewrites @distkit/components imports', () => {
    const input = `import { Button } from '@distkit/components/button'`
    const expected = `import { Button } from '@/components/button'`

    expect(rewriteImports(input, mockUserConfig)).toBe(expected)
  })

  it('rewrites @distkit/utilities imports', () => {
    const input = `import { normalizeClass } from '@distkit/utilities/styling'`
    const expected = `import { normalizeClass } from '@/utils/styling'`

    expect(rewriteImports(input, mockUserConfig)).toBe(expected)
  })

  it('handles double quotes', () => {
    const input = `import type { WithClass } from "@distkit/utilities/props"`
    const expected = `import type { WithClass } from "@/utils/props"`

    expect(rewriteImports(input, mockUserConfig)).toBe(expected)
  })

  it('rewrites multiple imports in one file', () => {
    const input = [
      `import { Button } from '@distkit/components/button'`,
      `import { Icon } from '@distkit/components/icon'`,
      `import { normalizeClass } from '@distkit/utilities/styling'`,
    ].join('\n')

    const expected = [
      `import { Button } from '@/components/button'`,
      `import { Icon } from '@/components/icon'`,
      `import { normalizeClass } from '@/utils/styling'`,
    ].join('\n')

    expect(rewriteImports(input, mockUserConfig)).toBe(expected)
  })

  it('leaves non-registry-spec imports unchanged', () => {
    const input = [
      `import { ref } from 'vue'`,
      `import path from 'node:path'`,
      `import { foo } from './local'`,
      `import foo from '@distkit/components-extra/foo'`,
      `import bar from '@distkit/utils-extra/bar'`,
    ].join('\n')

    expect(rewriteImports(input, mockUserConfig)).toBe(input)
  })

  it('uses any other custom aliases from config', () => {
    const custom = {
      components: {
        dir: 'lib/ui',
        import: '~/ui',
      },
      utilities: {
        dir: 'lib/helpers',
        import: '#/helpers',
      },
    } as UserConfig

    const input = [
      `import { X } from '@distkit/components/x'`,
      `import { y } from '@distkit/utilities/y'`,
    ].join('\n')

    const expected = [
      `import { X } from '~/ui/x'`,
      `import { y } from '#/helpers/y'`,
    ].join('\n')

    expect(rewriteImports(input, custom)).toBe(expected)
  })

  it('preserves nested paths', () => {
    const input = `import { Foo } from '@distkit/components/prose-code-icon/utils'`
    const expected = `import { Foo } from '@/components/prose-code-icon/utils'`

    expect(rewriteImports(input, mockUserConfig)).toBe(expected)
  })
})
