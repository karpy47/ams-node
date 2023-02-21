const { AuditLog } = require('../db/models')
const { ac, resources } = require('../middleware/authorization')
const { NotGrantedError, NotFoundError, InternalError } = require('../helpers/httpErrors')

async function readAll (req, res, next) {
  const permAny = ac.can(req.authUser.role).readAny(resources.auditLog)
  // TODO: examine pagination for getall-functions
  const { limit = 500 } = req.query
  const options = { limit }
  try {
    if (!permAny.granted) {
      return next(NotGrantedError())
    }
    const auditLogs = await AuditLog.findAll(options)
    res.status(200).json(auditLogs)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function read (req, res, next) {
  const { auditLogId } = req.params
  const permAny = ac.can(req.authUser.role).readAny(resources.auditLog)

  try {
    const auditLog = await AuditLog.findByPk(auditLogId)
    if (!auditLog) return next(NotFoundError())
    if (permAny.granted) {
      res.status(200).json(auditLog)
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
