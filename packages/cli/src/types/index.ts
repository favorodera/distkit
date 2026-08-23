/** Distkit configuration. */
export interface DistkitConfig {
  /** Configurations for components. */
  components: {
    /** Relative directory for components. */
    dir: string

    /** Import alias for components (e.g. "@/components"). */
    import: string
  }

  /** Configurations for utilities. */
  utils: {
    /** Relative directory for utilities. */
    dir: string

    /** Import alias for utilities (e.g. "@/utils"). */
    import: string
  }

  /** Named registry sources (name → index URL). */
  registries: Record<string, string>
}
