import type { Component, ItemType, Utility } from '@distkit/schema'

/** User project configuration. */
export interface UserConfig {
  /** Configurations for components. */
  components: {
    /** Relative directory for components. */
    dir: string

    /** Import alias for components (e.g. "@/components"). */
    import: string
  }

  /** Configurations for utilities. */
  utilities: {
    /** Relative directory for utilities. */
    dir: string

    /** Import alias for utilities (e.g. "@/utils"). */
    import: string
  }

  /** Named registry sources (name → index URL). */
  registries: Record<string, string>
}

/** Union type for generated item keys. */
export type GeneratedItemKey = `${'npmPackage' | ItemType}:${string}`

/** Union type for resolved registry items including npm packages. */
export type ResolvedRegistryItem = (
  | Pick<Component, 'files' | 'type'>
  | Pick<Utility, 'files' | 'type'>
  | {
    type: 'npmPackage'
    version: string
  })
  & { name: string }
