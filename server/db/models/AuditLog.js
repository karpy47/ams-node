'use strict'
const config = require('../../config')
const { Model } = require('sequelize')
const _ = require('lodash')

function shallowDiff (obj1, obj2, excludeKeys = []) {
  const result = {}
  for (const key of _.difference(_.keys(obj1), excludeKeys)) {
    if (obj2[key] !== obj1[key]) {
      result[key] = obj2[key]
    }
  }
  return result
}

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate (models) {
    }

    static async logCreate (model, options) {
      await AuditLog.log(config.auditActions.create, model, options)
    }

    static async logUpdate (model, options) {
      await AuditLog.log(config.auditActions.update, model, options)
    }

    static async logDelete (model, options) {
      await AuditLog.log(config.auditActions.delete, model, options)
    }

    static async log (action, model, options = {}) {
      let sourceType
      let sourceId = null
      if (options.userId != null) {
        sourceType = config.auditSources.user
        sourceId = options.userId
      } else if (options.patientId != null) {
        sourceType = config.auditSources.patient
        sourceId = options.patientId
      } else if (options.source !== '') {
        sourceType = options.source
      } else {
        sourceType = config.auditSources.unknown
      }
      const excludeKeys = options.exclude || []
      AuditLog.create({
        table: model.constructor.tableName,
        tableId: model.id,
        action,
        before: model.beforeDataValues,
        changed: shallowDiff(model.beforeDataValues, model.dataValues, excludeKeys),
        sourceType,
        sourceId
      })
    }
  };

  AuditLog.init({
    table: DataTypes.STRING,
    tableId: DataTypes.INTEGER,
    action: DataTypes.STRING,
    before: DataTypes.JSON,
    changed: DataTypes.JSON,
    sourceType: DataTypes.STRING,
    sourceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AuditLog',
    updatedAt: false
  })

  return AuditLog
}
