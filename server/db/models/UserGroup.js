'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserGroup extends Model {
    static associate (models) {
      UserGroup.hasMany(models.User, {
        foreignKey: 'userGroupId'
      })
      UserGroup.hasMany(models.Clinic, {
        foreignKey: 'userGroupId'
      })
    }

    toJSON () {
      const values = super.toJSON()
      delete values.deletedAt
      return values
    }
  };
  UserGroup.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    scopes: {
      // https://github.com/sequelize/sequelize/issues/9864
      showUsers: () => ({
        include: [
          { model: sequelize.models.User, attributes: ['id', 'name', 'email', 'role'] }
        ]
      }),
      showClinics: () => ({
        include: [
          { model: sequelize.models.Clinic, attributes: ['id', 'name'] }
        ]
      })
    },
    sequelize,
    modelName: 'UserGroup',
    paranoid: true
  })
  return UserGroup
}
