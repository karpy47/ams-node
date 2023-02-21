'use strict'
const { Model, Op } = require('sequelize')
const { Device } = require('./Device')
const { ValidationError } = require('../../helpers/httpErrors')

module.exports = (sequelize, DataTypes) => {
  class Component extends Model {
    static associate (models) {
      Component.hasMany(models.DeviceEvent, {
        foreignKey: 'componentId'
      })
      Component.belongsTo(models.Device, {
        foreignKey: 'deviceId',
        onDelete: 'NO ACTION',
        allowNull: true
      })
    }

    // Check if the device connected to this component already has another component with the same type
    // Only one type of component is allowed to be associated with each device
    static async typeExists (component) {
      if (component.deviceId) {
        const res = await Device.findAll({
          where: {
            deviceId: component.deviceId,
            id: { [Op.ne]: component.id }
          }
        })
        res.forEach(item => {
          if (item.type === component.type) return true
        })
      }
      return false
    }

    toJSON () {
      const values = super.toJSON()
      delete values.deletedAt
      return values
    }
  };
  Component.init({
    dmCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: DataTypes.STRING,
    type: DataTypes.STRING,
    partRefNo: DataTypes.STRING,
    manufacturedAt: DataTypes.DATE,
    discardedAt: DataTypes.DATE,
    manufactureWiRefNo: DataTypes.STRING,
    signatureManufacturing: DataTypes.STRING,
    signatureInspection: DataTypes.STRING,
    poNumber: DataTypes.STRING,
    comment: DataTypes.STRING
  }, {
    afterValidate: async (component, options) => {
      if (component.changed('deviceId')) {
        if (Component.typeExists(component)) {
          throw new ValidationError()
        }
      }
    },
    sequelize,
    modelName: 'Component',
    paranoid: true
  })
  return Component
}
