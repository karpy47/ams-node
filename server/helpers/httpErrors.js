const createError = require('http-errors')

function NotAuthorizedError (err = null, msg) {
  return createError(401, msg ?? 'Wrong credentials', err)
}

function NotGrantedError (err = null, msg) {
  return createError(403, msg ?? 'Permission not granted', err)
}

function InsufficientRoleError (err = null, msg) {
  return createError(403, msg ?? 'Insufficient role', err)
}

function NotFoundError (err = null, msg) {
  return createError(404, msg ?? 'Not found', err)
}

function IllegalRequestError (err = null, msg) {
  return createError(404, msg ?? 'Illegal request', err)
}

function AlreadyExistsError (err = null, msg) {
  return createError(409, msg ?? 'Already exists', err)
}

function ValidationError (err = null, msg) {
  return createError(422, msg ?? 'Validation failed', err)
}

function InternalError (err = null, msg) {
  return createError(500, msg ?? 'Internal error', err)
}

module.exports = { ValidationError, NotAuthorizedError, NotGrantedError, InsufficientRoleError, NotFoundError, IllegalRequestError, AlreadyExistsError, InternalError }
