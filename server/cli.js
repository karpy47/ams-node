#!/usr/bin/env node

const commander = require('commander')
const program = new commander.Command()
const userCommands = require('./commands/user.js')
const dbCommands = require('./commands/db.js')

program
  .action(() => {
    program.help()
  })
  .addCommand(dbCommands)
  .addCommand(userCommands)

program.parse(process.argv)
