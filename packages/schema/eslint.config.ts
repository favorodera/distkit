import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  css: false,
  tailwind: false,
  typescript: {
    overrides: {
      'new-cap': ['off'],
    },
  },
  vitest: false,
  vue: false,
})
  .append({
    files: ['package.json'],
    rules: {
      'jsonc/array-bracket-newline': 'off',
    },
  })
