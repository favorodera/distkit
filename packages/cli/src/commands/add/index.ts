import { defineCommand } from 'citty'
import { component } from './component'
import { utility } from './utility'

/**
 * Add registry item command.
 * @returns The command definition.
 */
export function add() {
  return defineCommand({
    meta: {
      description: 'Add a registry item',
      name: 'add',
    },
    subCommands: {
      component,
      utility,
    },
  })
}
