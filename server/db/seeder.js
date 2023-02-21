const chalk = require('chalk')
const { User, UserGroup } = require('../db/models')
const config = require('../config')
const { faker } = require('@faker-js/faker')

async function initDb (user, pwd, echo = true) {
  await createFirstUser(user, config.roles.superAdmin, 'SuperGroup', echo, pwd)
}

async function createFirstUser (email, role, group, echo = true, pwd = false) {
  try {
    let userGroup = await UserGroup.findOne({ where: { name: group } })
    if (!userGroup) {
      userGroup = await UserGroup.create({ name: group })
    }
    console.log(chalk.bgGreen('OK') + ` Default usergroup "${userGroup.name}" setup`)
    let user = await User.findOne({ where: { email } })
    if (!user) {
      user = User.build({ name: 'Default User' })
    }
    user.set({
      user: 'Default User',
      email,
      password: pwd || faker.lorem.word(),
      role,
      userGroupId: userGroup.id
    })
    user.rawPassword = user.password
    await user.save()
    if (echo) console.log(chalk.bgGreen('OK') + ` Default superadmin "${user.email}" setup with password "${user.rawPassword}"`)
  } catch (err) {
    if (echo) {
      console.log(chalk.bgRed('Fatal error') + ` Failed, please try later.\n${err}`)
    }
  }
}

module.exports = { initDb }
