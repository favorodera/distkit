import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  css: false,
  javascript: {
    overrides: {
      'no-await-in-loop': 'off',
    },
  },
  tailwind: false,
  typescript: {
    overrides: {
      'new-cap': ['off'],
    },
  },
  vue: false,
})
  .append({
    files: ['package.json'],
    rules: {
      'jsonc/array-bracket-newline': 'off',
    },
  })
