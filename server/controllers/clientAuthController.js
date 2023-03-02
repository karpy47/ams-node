const config = require('../config')
const { User, EventLog } = require('../db/models')
const { InternalError, NotAuthorizedError } = require('../helpers/httpErrors')
const { getValidationError } = require('../helpers/validation')
const { mailer } = require('../services/mailer')

async function login (req, res, next) {
  try {
    const error = getValidationError(req)
    if (error) return next(error)

    const user = await User.findOne({ where: { email: req.body.email } })
    if (user && (await user.verifyPassword(req.body.password) === true)) {
      user.generateAccessToken()
      user.generateRefreshToken()
      user.lastLoginAt = new Date()
      await user.save()
      EventLog.log(config.eventTypes.login, { userId: user.id })
      res.status(200).json({
        accessToken: user.accessToken,
        accessTokenExpiresIn: config.userAccess.accessTokenTTLsec,
        refreshToken: user.refreshToken,
        refreshTokenExpiresIn: config.userAccess.refreshTokenTTLsec,
        user
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
    const user = req.authUser
    user.accessToken = null
    user.refreshToken = null
    await user.save()
    EventLog.log(config.eventTypes.logout, { userId: user.id })
    res.status(200).json({ logoutAt: new Date() })
  } catch (err) {
    return next(InternalError(err))
  }
}

async function refresh (req, res, next) {
  try {
    const error = getValidationError(req)
    if (error) return next(error)

    const user = await User.findByPk(req.body.userId)
    if (user && user.verifyRefreshToken(req.body.refreshToken)) {
      user.generateAccessToken()
      user.generateRefreshToken()
      await user.save()
      EventLog.log(config.eventTypes.refresh, { userId: user.id })
      res.status(200).json({
        id: user.id,
        accessToken: user.accessToken,
        accessTokenExpiresIn: config.userAccess.accessTokenTTLsec,
        refreshToken: user.refreshToken,
        refreshTokenExpiresIn: config.userAccess.refreshTokenTTLsec
      })
    } else {
      EventLog.logFail(config.eventTypes.refreshTokenFail, req)
      return next(NotAuthorizedError())
    }
  } catch (err) {
    return next(InternalError(err))
  }
}

async function user (req, res, next) {
  try {
    const user = await User.scope('showUserGroup').findByPk(req.authUser.id)
    res.status(200).json(user)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function resetPasswordRequest (req, res, next) {
  try {
    const error = getValidationError(req)
    if (error) return next(error)

    const user = await User.findOne({ where: { email: req.body.email } })
    if (user) {
      user.generateResetPasswordToken()
      await user.save()
      await mailer.sendResetPassword(user)
      EventLog.log(config.eventTypes.resetPwdRequest, { userId: user.id })
    } else {
      EventLog.logFail(config.eventTypes.resetPwdRequestFail, req)
    }
    // Always return OK no matter result
    res.status(200).json({ responseAt: new Date() })
  } catch (err) {
    return next(InternalError(err))
  }
}

async function resetPassword (req, res, next) {
  try {
    const error = getValidationError(req)
    if (error) return next(error)

    const user = await User.findOne({ where: { email: req.body.email } })
    if (user && user.verifyResetPasswordToken(req.body.resetToken)) {
      user.password = req.body.password
      await user.save()
      EventLog.log(config.eventTypes.resetPwd, { userId: user.id })
      res.status(200).json({ responseAt: new Date() })
    } else {
      EventLog.logFail(config.eventTypes.resetPwdFail, req)
      return next(NotAuthorizedError())
    }
  } catch (err) {
    return next(InternalError(err))
  }
}

module.exports = { login, logout, refresh, user, resetPasswordRequest, resetPassword }
