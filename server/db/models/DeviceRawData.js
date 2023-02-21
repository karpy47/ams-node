'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class DeviceRawData extends Model {
    static associate (models) {
      DeviceRawData.belongsTo(models.Device, {
        foreignKey: {
          name: 'deviceId',
          allowNull: false
        },
        onDelete: 'NO ACTION'
      })
      DeviceRawData.belongsTo(models.Patient, {
        foreignKey: {
          name: 'patientId',
          allowNull: true
        },
        onDelete: 'NO ACTION'
      })
    }

    toJSON () {
      const values = super.toJSON()
      delete values.deletedAt
      return values
    }
  };
  DeviceRawData.init({
    rawData: DataTypes.STRING,
    downloadSource: DataTypes.STRING,
    downloadedAt: DataTypes.DATE,
    dataStartAt: DataTypes.DATE,
    dataEndAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'DeviceRawData',
    paranoid: true
  })
  return DeviceRawData
}
