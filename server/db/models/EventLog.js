'use strict'
const config = require('../../config')
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class EventLog extends Model {
    static associate (models) {
    }

    static async log (type, options) {
      let sourceType
      let sourceId = null
      if (options.userId != null) {
        sourceType = config.eventSources.user
        sourceId = options.userId
      } else if (options.patientId != null) {
        sourceType = config.eventSources.patient
        sourceId = options.patientId
      } else if (options.source != null) {
        sourceType = options.source
      } else {
        sourceType = config.eventSources.unknown
      }
      EventLog.create({
        type,
        message: options.message,
        sourceType,
        sourceId
      })
    }

    static async logFail (type, req) {
      const message = {
        ip: req.ip,
        url: req.protocol + '://' + req.get('host') + req.originalUrl,
        method: req.method
      }
      if (req.method !== 'GET') message.body = req.body
      const options = {
        message: JSON.stringify(message),
        source: config.eventSources.server
      }
      this.log(type, options)
    }
  };

  EventLog.init({
    type: DataTypes.STRING,
    message: DataTypes.STRING,
    sourceType: DataTypes.STRING,
    sourceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EventLog',
    updatedAt: false
  })

  return EventLog
}
