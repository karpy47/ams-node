const BearerStrategy = require('passport-http-bearer')
const { User, EventLog } = require('../../db/models')
const { NotAuthorizedError, InternalError } = require('../../helpers/httpErrors')
const config = require('../../config')

const bearerStrategy = new BearerStrategy({ passReqToCallback: true },
  async function (req, token, done) {
    try {
      const user = await User.findOne({ where: { accessToken: token } })
      if (user && User.isTokenValid(token)) {
        return done(null, user)
      }
      EventLog.logFail(config.eventTypes.accessTokenFail, req)
      return done(NotAuthorizedError(), false)
    } catch (err) {
      return done(InternalError(err))
    }
  }
)

module.exports = bearerStrategy
