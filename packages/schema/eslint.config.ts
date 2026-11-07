import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  tailwind: false,
  vitest: false,
  css:false,
  vue: false,
  typescript:{
    overrides:{
      'new-cap': ['off'],
    }
  }
})
