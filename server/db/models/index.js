'use strict'

const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
const Sequelize = require('sequelize')
const _ = require('lodash')
const config = require('../../config')
const db = {}

// Need to save data values from db after any query fetching data
// For a model: _previousDataValues = dataValues after save()
// https://github.com/sequelize/sequelize/issues/12531
const globalHooks = {
  hooks: {
    afterFind (instance, options) {
      if (instance) {
        // only use data values for attributes (keys) defined in model for DB (found in rawAttributes)
        instance.beforeDataValues = _.pick(instance.dataValues, _.keys(instance.rawAttributes))
      }
    }
  }
}

const dbConn = config.db[config.app.env]
const sequelize = new Sequelize(dbConn.url, _.merge({}, dbConn.options, globalHooks))

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
