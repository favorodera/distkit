import { defineCommand, runMain } from 'citty'
import { version } from '../package.json'
import { add } from './commands/add'
import { init } from './commands/init'

const main = defineCommand({
  meta: { name: 'distkit', version },
  subCommands: {
    add,
    init,
  },
})

runMain(main)
