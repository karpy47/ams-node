const { Patient, EventLog } = require('../db/models')
const { NotAuthorizedError, InternalError } = require('../helpers/httpErrors')
const { getValidationError } = require('../helpers/validation')
const _ = require('lodash')
const config = require('../config')

async function signup (req, res, next) {
  try {
    const error = getValidationError(req)
    if (error) return next(error)
    const allowed = ['password', 'email', 'phone']
    const patient = await Patient.create(_.pick(req.body, allowed))

    res.status(201).json({ id: patient.id })
  } catch (err) {
    return next(InternalError(err))
  }
}

async function login (req, res, next) {
  try {
    const error = getValidationError(req)
    if (error) return next(error)
    const { id, password } = req.body
    const patient = await Patient.findByPk(id)
    if (patient && (await patient.verifyPassword(password) === true)) {
      patient.generateAccessToken()
      patient.generateRefreshToken()
      patient.lastLoginAt = new Date()
      await patient.save()
      EventLog.log(config.eventTypes.login, { patentId: patient.id })
      res.status(200).json({
        id: patient.id,
        accessToken: patient.accessToken,
        accessTokenExpiresIn: config.patientAccess.accessTokenTTLsec,
        refreshToken: patient.refreshToken,
        refreshTokenExpiresIn: config.patientAccess.refreshTokenTTLsec
      })
    } else {
      EventLog.logFail(config.eventTypes.loginFail, req)
      return next(NotAuthorizedError())
    }
  } catch (err) {
    return next(InternalError(err))
  }
}

async function logout (req, res, next) {
  try {
    const patient = req.authPatient
    patient.accessToken = null
    patient.refreshToken = null
    await patient.save()
    EventLog.log(config.eventTypes.logout, { patientId: patient.id })
    res.status(200).json({ logoutAt: new Date() })
  } catch (err) {
    return next(InternalError(err))
  }
}

async function refresh (req, res, next) {
  try {
    const error = getValidationError(req)
    if (error) return next(error)

    const patient = await Patient.findByPk(req.body.id)
    if (patient.verifyRefreshToken(req.body.refreshToken)) {
      patient.generateAccessToken()
      patient.generateRefreshToken()
      await patient.save()
      EventLog.log(config.eventTypes.refresh, { patentId: patient.id })
      res.status(200).json({
        id: patient.id,
        accessToken: patient.accessToken,
        accessTokenExpiresIn: config.patientAccess.accessTokenTTLsec,
        refreshToken: patient.refreshToken,
        refreshTokenExpiresIn: config.patientAccess.refreshTokenTTLsec
      })
    } else {
      EventLog.logFail(config.eventTypes.refreshTokenFail, req)
      return next(NotAuthorizedError())
    }
  } catch (err) {
    return next(InternalError(err))
  }
}

module.exports = { signup, login, logout, refresh }
