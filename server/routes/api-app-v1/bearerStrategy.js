const BearerStrategy = require('passport-http-bearer')
const { Patient, EventLog } = require('../../db/models')
const { NotAuthorizedError, InternalError } = require('../../helpers/httpErrors')
const config = require('../../config')

const bearerStrategy = new BearerStrategy({ passReqToCallback: true },
  async function (req, token, done) {
    try {
      const patient = await Patient.findOne({ where: { accessToken: token } })
      if (patient && Patient.isTokenValid(token)) {
        return done(null, patient)
      }
      EventLog.logFail(config.eventTypes.accessTokenFail, req)
      return done(NotAuthorizedError(), false)
    } catch (err) {
      return done(InternalError(err))
    }
  }
)

module.exports = bearerStrategy
