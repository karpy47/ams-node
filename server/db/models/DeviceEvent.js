'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class DeviceEvent extends Model {
    static associate (models) {
      DeviceEvent.belongsTo(models.Device, {
        foreignKey: {
          name: 'deviceId',
          allowNull: true
        },
        onDelete: 'NO ACTION'
      })
      DeviceEvent.belongsTo(models.Component, {
        foreignKey: {
          name: 'componentId',
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
  DeviceEvent.init({
    type: DataTypes.STRING,
    eventAt: DataTypes.DATE,
    part: DataTypes.STRING,
    description: DataTypes.STRING,
    signature: DataTypes.STRING,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DeviceEvent',
    paranoid: true
  })
  return DeviceEvent
}
