const { EventLog } = require('../db/models')
const { ac, resources } = require('../middleware/authorization')
const { NotGrantedError, NotFoundError, InternalError } = require('../helpers/httpErrors')

async function readAll (req, res, next) {
  const permAny = ac.can(req.authUser.role).readAny(resources.eventLog)
  // TODO: examine pagination for getall-functions
  const { limit = 500 } = req.query
  const options = { limit }
  try {
    if (!permAny.granted) {
      return next(NotGrantedError())
    }
    const eventLogs = await EventLog.findAll(options)
    res.status(200).json(eventLogs)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function read (req, res, next) {
  const { eventLogId } = req.params
  const permAny = ac.can(req.authUser.role).readAny(resources.eventLog)

  try {
    const eventLog = await EventLog.findByPk(eventLogId)
    if (!eventLog) return next(NotFoundError())
    if (permAny.granted) {
      res.status(200).json(eventLog)
    } else {
      return next(NotGrantedError())
    }
  } catch (err) {
    return next(InternalError(err))
  }
}

module.exports = {
  readAll, read
}
