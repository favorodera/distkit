import { defineConfig } from '@favorodera/eslint-config'

export default defineConfig({
  tailwind: false,
  css:false,
  vue: false,
  typescript:{
    overrides:{
      'new-cap': ['off'],
    }
  }
})
