'use strict'
const config = require('../../config')
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    static associate (models) {
      Clinic.belongsTo(models.UserGroup, {
        foreignKey: {
          name: 'userGroupId',
          allowNull: false
        },
        onDelete: 'NO ACTION'
      })
      Clinic.hasMany(models.Patient, {
        foreignKey: {
          name: 'clinicId'
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
  Clinic.init({
    status: {
      type: DataTypes.STRING,
      defaultValue: config.status.active
    },
    name: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    postcode: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    openHours: DataTypes.STRING
  }, {
    scopes: {
      // https://github.com/sequelize/sequelize/issues/9864
      showUserGroup: () => ({
        include: [
          { model: sequelize.models.UserGroup, attributes: ['name', 'description'] }
        ]
      })
    },
    hooks: {
      beforeDestroy: async (clinic, options) => {
        clinic.status = config.status.deleted
      }
    },
    sequelize,
    modelName: 'Clinic',
    paranoid: true
  })
  return Clinic
}
