import { defineCommand, runMain } from 'citty'
import { version } from '../package.json'
import { init } from './commands/init'

const main = defineCommand({
  meta: { name: 'distkit', version },
  subCommands: {
    init,
  },
})

runMain(main)
