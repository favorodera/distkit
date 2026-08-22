import { factory } from '@favorodera/eslint-config'

export default factory({
  pnpm: false,
  tailwind: false,
  test: false,
  vue: false,
})
  .append({
    files: ['**/*.ts'],
    rules: {
      'new-cap': ['off'],
    },
  })
