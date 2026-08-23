import { cancel, confirm, isCancel } from '@clack/prompts'
import { type Item, type ItemType, toRelativePath } from '@distkit/schema'
import fsExtra from 'fs-extra'
import { basename, join } from 'pathe'
import type { UserConfig } from '../types'

/**
 * Confirms whether a user wants to overwrite a path
 * @param path The path to check for overwriting
 * @returns The user's decision to overwrite the path
 */
export async function confirmPathOverwrite(path: string) {
  const pathExists = await fsExtra.pathExists(path)

  // If path does not exist, then there is nothing to overwrite
  if (!pathExists) {
    return true
  }

  const userDecision = await confirm({
    // False so that user doesn't mistakenly overwrite files they don't intend to
    initialValue: false,
    message: `Do you want to overwrite "${toRelativePath(path)}"?`,
  })

  // User cancelled the operation
  if (isCancel(userDecision)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  return userDecision
}

/**
 * Resolves the install directory for an item
 * @param type The type of item to install
 * @param config The user configuration
 * @returns The install directory for the item
 */
export function resolveItemInstallDir(type: ItemType, config: UserConfig) {
  switch (type) {
    case 'component': {
      return config.components.dir
    }
    case 'utility': {
      return config.utils.dir
    }
    default: {
      throw new Error(`Cannot resolve install directory for "${type}"`)
    }
  }
}

/**
 * Resolves the install path for a given item's file
 * @param item The item to resolve the file install path for
 * @param filePath The file to resolve the install path for
 * @param config The user configuration
 * @returns The install path for the item's file
 */
export function resolveItemFileInstallPath(item: Item, filePath: string, config: UserConfig) {
  const cwd = process.cwd()
  const installDir = resolveItemInstallDir(item.type, config)
  const fileName = basename(filePath)

  switch (item.type) {
    case 'component': {
      // Components install into a named subdirectory eg: components/<component-name>/file.vue
      return join(cwd, installDir, item.name, fileName)
    }
    case 'utility': {
      // Utilities install into a flat directory eg: utilities/file.ts
      return join(cwd, installDir, fileName)
    }
  }
}

/**
 * Confirms whether a user wants to overwrite all files for an item
 * @param item The item to confirm overwriting for
 * @param config The user configuration
 * @returns A map of file paths to boolean overwrite decisions
 */
export async function confirmItemFilesOverwrite(item: Item, config: UserConfig) {
  const cwd = process.cwd()
  const userDecisions = new Map<string, boolean>()

  switch (item.type) {
    case 'component': {
      // Prompt once per component directory
      const targetDir = join(cwd, resolveItemInstallDir(item.type, config), item.name)

      const userDecision = await confirmPathOverwrite(targetDir)

      // Then use that to decide whether to overwrite each file
      for (const file of item.files) {
        const targetPath = resolveItemFileInstallPath(item, file, config)

        userDecisions.set(targetPath, userDecision)
      }
      break
    }
    case 'utility': {
      // Prompt per file for utilities
      for (const file of item.files) {
        const targetPath = resolveItemFileInstallPath(item, file, config)

        const userDecision = await confirmPathOverwrite(targetPath)

        userDecisions.set(targetPath, userDecision)
      }
      break
    }
  }

  return userDecisions
}
