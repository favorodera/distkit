import type { EnumArgDef, PositionalArgDef, StringArgDef } from 'citty'
import { basename } from 'pathe'
import { version } from '../../package.json'

/** The default registry name. */
export const defaultRegistryName = 'distkit'

/** The default registry index URL. */
export const defaultRegistryIndexUrl = `https://raw.githubusercontent.com/favorodera/distkit/refs/tags/v${version}/registry/index.json`

/** The name of the user configuration file. */
export const userConfigFileName = 'distkit.config.ts'

/** The base name of the user configuration file. */
export const userConfigFileBaseName = basename(userConfigFileName, '.config.ts')

/** Common arguments for commands. */
export const commonArgs = {
  registry: {
    alias: 'r',
    default: defaultRegistryName,
    description: 'Registry name',
    required: true,
    type: 'string',
    valueHint: 'registry-name',
  },
} satisfies Record<string, EnumArgDef | PositionalArgDef | StringArgDef> 
