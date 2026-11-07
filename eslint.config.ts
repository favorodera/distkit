import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  ignores: ['playground/', 'packages/'],
  css: false,
  perfectionist: {
    settings: {
      tsconfig: {
        rootDir: '',
      },
    },
  },
  tailwind: false,
  vitest: false,
})
