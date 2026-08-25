import { factory } from '@favorodera/eslint-config'

export default factory({
  ignores: ['./apps/playground/**'],
  tailwind: false,
  test: false,
  vue: false,
})
