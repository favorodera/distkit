import { loadConfig } from 'c12'
import JSON5 from 'json5'
import type { UserConfig } from '../types'
import { userConfigFileBaseName } from './constants'

/**
 * Loads the user configuration from the current working directory or its parents.
 * @returns The user configuration.
 * @throws Error if the user configuration file cannot be found.
 */
export async function loadUserConfig() {
  const cwd = process.cwd()

  const userConfig = await loadConfig<UserConfig>({
    cwd,
    name: userConfigFileBaseName,
  })

  if (!userConfig.configFile) {
    throw new Error(`Could not find "${userConfigFileBaseName}.config.ts" in the current working directory or its parents.`)
  }

  return userConfig.config
}

/**
 * Generates a user configuration file.
 * @param config The user configuration.
 * @returns The user configuration file content.
 */
export function generateUserConfig(config: UserConfig) {
  const userConfigContent = JSON5.stringify(config, {
    quote: `'`,
    space: 2,
  })

  return `import { defineConfig } from '@distkit/core'

export default defineConfig(${userConfigContent})`
}
