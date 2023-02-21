'use strict'
const config = require('../../config')
const { Model } = require('sequelize')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate (models) {
      Patient.belongsTo(models.Clinic, {
        foreignKey: 'clinicId',
        onDelete: 'NO ACTION'
      })
      Patient.belongsTo(models.Device, {
        foreignKey: 'deviceId',
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
      const ttl = config.patientAccess.accessTokenTTLsec
      this.accessToken = Patient.generateToken(chars, ttl)
    }

    generateRefreshToken (chars = 20) {
      const ttl = config.patientAccess.refreshTokenTTLsec
      this.refreshToken = Patient.generateToken(chars, ttl)
    }

    generateActivationToken (chars = 20) {
      const ttl = config.patientAccess.resetPasswordTokenTTLsec
      this.resetPasswordToken = Patient.generateToken(chars, ttl)
    }

    verifyAccessToken (token) {
      return (token === this.accessToken && Patient.isTokenValid(this.accessToken))
    }

    verifyRefreshToken (token) {
      return (token === this.refreshToken && Patient.isTokenValid(this.refreshToken))
    }

    verifyResetPasswordToken (token) {
      return (token === this.resetPasswordToken && Patient.isTokenValid(this.resetPasswordToken))
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

    anonymise () {
      // status
      this.firstname = null
      this.lastname = null
      this.address1 = null
      this.address2 = null
      // postcode, city, country
      this.personalId = null
      this.email = null
      this.phone = null
      // gender
      this.birthDate = null
      this.password = null
      this.accessToken = null
      this.refreshToken = null
      this.resetPasswordToken = null
      this.comment = null
      this.lastLoginAt = null
      this.deceaseDate = null
      this.anonymisedAt = sequelize.fn('NOW')
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

    changeClinic (newClinic) {
      this.clinicId = newClinic.id
    }
  };
  Patient.init({
    status: {
      type: DataTypes.STRING,
      defaultValue: config.status.active
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    postcode: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    personalId: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    password: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    comment: DataTypes.TEXT,
    lastLoginAt: DataTypes.DATE,
    deceaseDate: DataTypes.DATE,
    anonymisedAt: DataTypes.DATE
  }, {
    scopes: {
      clinic (id) {
        return { where: { clincId: id } }
      },
      // https://github.com/sequelize/sequelize/issues/9864
      showIncludes: () => ({
        include: [
          { model: sequelize.models.Device },
          { model: sequelize.models.Clinic }
        ]
      }),
      fullProfile: () => ({
        include: [
          { model: sequelize.models.Device },
          { model: sequelize.models.Clinic }
        ]
      })
    },
    hooks: {
      beforeSave: async (patient, options) => {
        if (patient.changed('password') && patient.password !== null) {
          await patient.hashPassword()
          // patient.beforeDataValues = _.clone(patient._previousDataValues)
        }
      },
      beforeDestroy: async (patient, options) => {
        patient.status = config.status.deleted
      }
    },
    sequelize,
    modelName: 'Patient',
    paranoid: true
  })
  return Patient
}
