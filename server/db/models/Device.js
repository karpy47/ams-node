'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate (models) {
      Device.hasMany(models.DeviceEvent, {
        foreignKey: 'deviceId'
      })
      Device.hasMany(models.DeviceRawData, {
        foreignKey: 'deviceId'
      })
      Device.hasOne(models.Patient, {
        foreignKey: 'deviceId'
      })
      Device.hasMany(models.Component, {
        foreignKey: 'deviceId'
      })
    }

    toJSON () {
      const values = super.toJSON()
      delete values.deletedAt
      return values
    }
  };
  Device.init({
    serialNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    modelRefNo: DataTypes.STRING,
    manufacturedAt: DataTypes.DATE,
    manufactureWiRefNo: DataTypes.STRING,
    signatureManufacturing: DataTypes.STRING,
    signatureInspection: DataTypes.STRING,
    comment: DataTypes.TEXT,
    firstUseAt: DataTypes.DATE,
    lastUseAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Device',
    paranoid: true
  })
  return Device
}
