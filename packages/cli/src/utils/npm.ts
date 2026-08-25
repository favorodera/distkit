import { addDependency } from 'nypm'

/**
 * Installs an npm package.
 * @param name The name of the package to install.
 * @param version The version of the package to install.
 */
export async function installNpmPackage(name: string, version: string) {
  const cwd = process.cwd()

  try {
    await addDependency(`${name}@${version}`, {
      cwd,
      silent: true,
    })
  } catch (error) {
    throw new Error(`Failed to install package ${name} from npm`, { cause: error })
  }
}
