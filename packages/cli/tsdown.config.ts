import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: true,
  entry: {
    index: 'src/index.ts',
    types: 'src/types/index.ts',
  },
  exports: true,
  fromVite: 'vitest',
  minify: true,
})
