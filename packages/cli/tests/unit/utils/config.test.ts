import { describe, expect, it } from 'vitest'
import { generateUserConfig } from '../../../src/utils/config'
import { mockUserConfig } from '../../utils'

describe('generateUserConfig', () => {
  it('generates a valid user config module', async () => {
    const content = generateUserConfig(mockUserConfig)

    await expect(content).toMatchFileSnapshot('./__snapshots__/valid-user-config.txt')
  })
})
