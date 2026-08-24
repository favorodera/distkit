import { defineConfig } from '@distkit/core'

export default defineConfig({
  components: {
    dir: 'src/components',
    import: '@/components',
  },
  registries: {
    distkit: 'https://raw.githubusercontent.com/favorodera/distkit/refs/tags/v0.0.1-alpha.0/registry/index.json',
  },
  utilities: {
    dir: 'src/utils',
    import: '@/utils',
  },
})