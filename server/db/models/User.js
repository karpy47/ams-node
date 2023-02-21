'use strict'
const config = require('../../config')
const { Model } = require('sequelize')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.belongsTo(models.UserGroup, {
        foreignKey: 'userGroupId',
        onDelete: 'NO ACTION'
      })
    }

    static generateToken (chars, timeToLive) {
      const pool = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz!#$%&*+-_'
      let randomToken = ''
      for (let i = 0; i < chars; i++) {
        randomToken += pool[crypto.randomInt(0, pool.length - 1)]
      }
      const expireTimestamp = Math.floor(Date.now() / 1000) + timeToLive
      return randomToken + '.' + expireTimestamp
    }

    static isTokenValid (token) {
      const tokenTimeout = token.split('.').pop()
      return (Math.floor(Date.now() / 1000) < tokenTimeout)
    }

    generateAccessToken (chars = 20) {
      const ttl = config.userAccess.accessTokenTTLsec
      this.accessToken = User.generateToken(chars, ttl)
    }

    generateRefreshToken (chars = 20) {
      const ttl = config.userAccess.refreshTokenTTLsec
      this.refreshToken = User.generateToken(chars, ttl)
    }

    generateResetPasswordToken (chars = 20) {
      const ttl = config.userAccess.resetPasswordTokenTTLsec
      this.resetPasswordToken = User.generateToken(chars, ttl)
    }

    verifyAccessToken (token) {
      return (token === this.accessToken && User.isTokenValid(token))
    }

    verifyRefreshToken (token) {
      return (token === this.refreshToken && User.isTokenValid(token))
    }

    verifyResetPasswordToken (token) {
      return (token === this.resetPasswordToken && User.isTokenValid(token))
    }

    getResetPasswordParams (url) {
      return encodeURI(url + '?u=' + this.user.email + '&t=' + this.resetPasswordToken)
    }

    async hashPassword () {
      const saltRounds = 10
      // await/async recommended for hash as it is CPU intensive
      // https://www.npmjs.com/package/bcrypt
      this.password = await bcrypt.hash(this.password, saltRounds)
    }

    async verifyPassword (password) {
      return await bcrypt.compare(password, this.password)
    }

    changeUserGroup (newUserGroup) {
      this.userGroupId = newUserGroup.id
    }

    anonymise () {
      // status
      this.name = null
      // TODO: set dummy unique email
      // this.email = null
      this.phone = null
      this.password = null
      this.accessToken = null
      this.refreshToken = null
      this.resetPasswordToken = null
      this.lastLoginAt = null
    }

    toJSON () {
      const values = super.toJSON()
      // remove user access info from all output
      delete values.password
      delete values.accessToken
      delete values.refreshToken
      delete values.resetPasswordToken
      delete values.deletedAt
      return values
    }
  };
  User.init({
    status: {
      type: DataTypes.STRING,
      defaultValue: config.status.active
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: { isEmail: true }
    },
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    lastLoginAt: DataTypes.DATE,
    autoLogoutAfter: {
      type: DataTypes.INTEGER,
      validate: { min: 60, max: 3600 }
    }
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
      beforeSave: async (user, options) => {
        if (user.changed('password')) await user.hashPassword()
      },
      afterSave: async (user, options) => {
        if (user.changed('password')) {
          // sequelize.models.EventLog.log(config.eventTypes.pwdChange, { userId: user.id })
        }
      },
      beforeDestroy: async (user, options) => {
        user.status = config.status.deleted
      }
    },
    sequelize,
    modelName: 'User',
    paranoid: true
  })
  return User
}
