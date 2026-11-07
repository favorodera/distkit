import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  css: false,
  tailwind: false,
  typescript: {
    overrides: {
      'new-cap': ['off'],
    },
  },
  vue: false,
  javascript:{
    overrides:{
      'no-await-in-loop':'off'
    }
  }
})
  .append({
    files: ['package.json'],
    rules: {
      'jsonc/array-bracket-newline': 'off',
    },
  })
