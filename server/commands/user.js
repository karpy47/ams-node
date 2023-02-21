const { sequelize } = require('sequelize')
const commander = require('commander')
const chalk = require('chalk')
const user = new commander.Command('user')
const createSuper = new commander.Command('create')
const changePassword = new commander.Command('change-pwd')
const showSuper = new commander.Command('show')

const { User, UserGroup, AuditLog } = require('../db/models')
const roles = require('../config').roles
const config = require('../config')

createSuper
  .description('Setup a default super admin and usergroup')
  .requiredOption('-e, --email <string>', 'Unique email for login')
  .requiredOption('-p, --password <string>', 'Password')
  .action(async (options) => {
    try {
      let userGroup = await UserGroup.findOne({ where: { name: 'SuperGroup' } })
      if (userGroup) {
        console.log(chalk.bgGreen('OK') + ' Found existing default user group \n')
      } else {
        userGroup = await UserGroup.create({
          name: 'SuperGroup',
          description: 'Default usergroup for super admin'
        })
        console.log(chalk.bgGreen('OK') + ` Created user group "${userGroup.name}"\n`)
      }
      const user = await User.create({
        name: 'Super Admin',
        email: options.email,
        password: options.password,
        role: roles.superAdmin,
        userGroupId: userGroup.id
      })
      AuditLog.logCreate(user, { source: config.auditSourceTypes.cli })
      console.log(chalk.bgGreen('Success') + ` Created new user "${user.email}"\n`)
    } catch (err) {
      console.log(chalk.bgRed('Fatal error') + ` Failed, please try later.\n${err}\n`)
    }
  })

changePassword
  .description('Change any user\'s password')
  .requiredOption('-e, --email <string>', 'Email of user')
  .requiredOption('-p, --password <string>', 'New password for user')
  .action(async (options) => {
    try {
      const user = await User.findOne({ where: { email: options.email } })
      if (user) {
        user.password = options.password
        await user.save()
        AuditLog.logUpdate(user, { source: config.auditSourceTypes.cli })
        console.log(chalk.bgGreen('Success') + ' Changed password.\n')
      } else {
        console.log(chalk.bgRed('Failed') + ` No user found with email "${options.user}".\n`)
      }
    } catch (err) {
      console.log(chalk.bgRed('Fatal error') + `\n${err}\n`)
    }
  })

showSuper
  .description('Show all super users/admins')
  .action(async (options) => {
    try {
      const users = await User.findAll({ where: { role: [roles.superAdmin, roles.superUser] } })
      if (users.length) {
        console.log('\nList of all super users\n')
        console.log(
          'Name'.padEnd(20, ' ') +
          'Email'.padEnd(20, ' ') +
          'Role'.padEnd(10, ' ')
        )
        console.log('-'.repeat(50))
        for (const user of users) {
          console.log(
            (user.name || '').padEnd(20, ' ') +
            (user.email || '').padEnd(20, ' ') +
            (user.role || '').padEnd(10, ' ')
          )
        }
        console.log('\n')
      }
    } catch (err) {
      console.log(chalk.bgRed('Fatal error') + `\n${err}\n`)
    }
  })

user
  .description('Commands for user admin')
  .helpOption(false)
  .action(() => {
    user.help()
  })
  .hook('postAction', () => { process.exit() })
  .addCommand(showSuper)
  .addCommand(createSuper)
  .addCommand(changePassword)

module.exports = user
