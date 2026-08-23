import { defineCommand, runMain } from 'citty'
import { version } from '../package.json'

const main = defineCommand({
  meta: { name: 'distkit', version },
  subCommands: {},
})

runMain(main)
