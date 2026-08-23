import { relative } from 'pathe'

/**
 * Converts an absolute path to a relative path.
 * @param target The absolute target path to convert.
 * @param from The absolute from path to convert from. Defaults to process.cwd().
 * @returns The relative path.
 */
export function toRelativePath(target: string, from: string = process.cwd()) {
  return relative(from, target)
}
