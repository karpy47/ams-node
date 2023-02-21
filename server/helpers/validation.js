const { ValidationError } = require('./httpErrors')
const { validationResult } = require('express-validator')

function getValidationError (req) {
  const errorFormat = ({ msg, param }) => {
    return ` ${param} (${msg})`
  }
  const errors = validationResult(req).formatWith(errorFormat)
  if (!errors.isEmpty()) {
    return ValidationError('Parameter validation failed ' + errors.array())
  } else {
    return false
  }
}

module.exports = { getValidationError }
