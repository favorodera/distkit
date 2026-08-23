import type { UserConfig } from '../types'

/**
 * Rewrites imports to use user's configured import aliases
 *
 * Only imports using the internal registry namespaces are rewritten
 * @param content The content to rewrite imports in
 * @param config The user configuration
 * @returns The content with imports rewritten
 */
export function rewriteImports(content: string, config: UserConfig) {
  return content
    .replaceAll(
      /(['"])@distkit\/components\/([^'"]+)\1/g,
      (_, quote, path) => `${quote}${config.components.import}/${path}${quote}`,
    )
    .replaceAll(
      /(['"])@distkit\/utilities\/([^'"]+)\1/g,
      (_, quote, path) => `${quote}${config.utilities.import}/${path}${quote}`,
    )
}
