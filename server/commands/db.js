// first load config and set environment to test
const { sequelize } = require('../db/models')
const config = require('../config')
const { Umzug, SequelizeStorage } = require('umzug')
const path = require('path')
const chalk = require('chalk')
const { initDb } = require('../db/seeder')
const { rndInt, populatedUserGroup, populatedDevice } = require('../helpers/fakers')
const { Component, Device } = require('../db/models')

const commander = require('commander')
const db = new commander.Command('db')
const migrate = new commander.Command('migrate')
const up = new commander.Command('up')
const down = new commander.Command('down')
const pending = new commander.Command('pending')
const executed = new commander.Command('executed')
const reset = new commander.Command('reset')
const init = new commander.Command('init')
const seed = new commander.Command('seed')

const activeEnv = '\n' + chalk.inverse('Active environment: "' + config.app.env + '"') + '\n'

migrate
  .description('Commands for database migration.')
  .addHelpText('before', activeEnv)
  .addCommand(up)
  .addCommand(down)
  .addCommand(pending)
  .addCommand(executed)

db
  .description('Commands for migrating and seeding the currently active database.')
  .addHelpText('before', activeEnv)
  .helpOption(false)
  .action(() => {
    db.help()
  })
  .hook('postAction', () => { process.exit() })
  .addCommand(migrate)
  .addCommand(reset)
  .addCommand(init)
  .addCommand(seed)

// *** Migrations ***

const umzug = new Umzug({
  migrations: {
    glob: ['*.js', { cwd: path.join(__dirname, '../db/migrations/') }]
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: null
})

const migrateUp = async () => {
  console.log('\nMigrating up all pending migrations...\n')
  const migrations = await umzug.up()
  logMigrations(migrations)
  console.log(chalk.bgGreen('Success') + ' Migrated up all pending migrations.\n')
}

const migrateDown = async (all = false) => {
  let migrations = []
  if (all) {
    console.log('\nMigrating down *all* migrations...\n')
    migrations = await umzug.down({ to: 0 })
  } else {
    console.log('\nMigrating down *one* migration.\n')
    migrations = await umzug.down()
  }
  logMigrations(migrations)
  console.log(chalk.bgGreen('Success') + ' Migrated down ' + (all ? 'all migrations' : 'one migration') + '.\n')
}

const logMigrations = (migrations) => {
  if (migrations.length === 0) {
    console.log('--- None ---')
  } else {
    migrations.forEach((migration) => console.log('  > ' + migration.name))
  }
  console.log('')
}

up
  .description('Migrate up all pending migrations.')
  .action(async () => {
    await migrateUp()
  })

down
  .description('Reverse migrations (one or all).')
  .option('-a, --all', 'Reverse all migrations (default=false)', false)
  .action(async (options) => {
    await migrateDown(options.all)
  })

pending
  .description('Migrations waiting to run.')
  .action(async () => {
    console.log('\nPending migrations\n')
    const migrations = await umzug.pending()
    logMigrations(migrations)
  })

executed
  .description('Migrations already executed.')
  .action(async () => {
    console.log('\nExecuted migrations\n')
    const migrations = await umzug.executed()
    logMigrations(migrations)
  })

// *** DB actions ***

reset
  .description('Clear database using migrate all down/up.')
  .action(async (options) => {
    if (config.isDevEnv || config.isTestEnv) {
      await migrateDown(true)
      await migrateUp()
      sequelize.close()
      console.log(chalk.bgGreen('\nSuccess') + ' Database cleared and migrate up fully.')
    } else {
      console.log(chalk.bgRed('\nFailed') + ' Database reset is only allowed in dev or test environment.')
    }
    console.log('\n')
  })

init
  .description('Setup database with initial data.')
  .option('-u, --user', 'Email for inital user', 'kj@abilion.com')
  .option('-p, --pwd', 'Password for inital user', 'kjkj')
  .action(async (options) => {
    if (config.isDevEnv || config.isTestEnv) {
      await initDb(options.user, options.pwd)
      console.log(chalk.bgGreen('\nSuccess') + ' Database setup with initial data (default group and user).')
    } else {
      console.log(chalk.bgRed('\nFailed') + ' Init is only allowed in dev or prod environment.')
    }
    console.log('\n')
  })

seed
  .description('Seed DB with random stuff')
  .option('-ug, --usergroups <int>', 'Number of usergroups to generate (default=10)', 10)
  .option('-d, --devices <int>', 'Number of devices to generate (default=100)', 100)
  .hook('postAction', () => { process.exit() })
  .action(async (options) => {
    if (config.isDevEnv || config.isTestEnv) {
      // Devices, components
      console.log('\nPopulating devices:')
      const deviceBase = 10000 + await Device.count()
      const componentBase = 10000 + await Component.count()
      let componentsCount = componentBase
      for (let i = 0; i < options.devices; i++) {
        const addComponents = Math.min(rndInt(0, 20), 6)
        await populatedDevice(deviceBase + i, componentsCount, addComponents)
        componentsCount = componentsCount + addComponents
      }
      componentsCount = componentsCount - componentBase
      console.log(`${options.devices} devices have been populated with ${componentsCount} components`)
      // Usergroups, users, clinics, patients
      console.log('\nPopulating usergroups:')
      for (let i = 0; i < options.usergroups; i++) {
        const usersCount = rndInt(3, 10)
        const clinicsCount = rndInt(3, 20)
        const patientsCount = rndInt(3, 50)
        const group = await populatedUserGroup(usersCount, clinicsCount, patientsCount)
        console.log(`Group '${group.name}' now has ${usersCount} users, ${clinicsCount} clinics, ${patientsCount} patients/clinic`)
      }
      // Done
      console.log(chalk.bgGreen('OK') + ' Done')
    } else {
      console.log(chalk.bgRed('\nFailed') + ' Seed is only allowed in dev or test environment.')
    }
    console.log('\n')
  })

module.exports = db
