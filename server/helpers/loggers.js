const config = require('../config')
const winston = require('winston')
const { combine, timestamp, prettyPrint } = winston.format
const morgan = require('morgan')
const path = require('path')

const logDirectory = path.join(__dirname, '../logs')

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), prettyPrint()),
  exitOnError: true
})
// stream object to be used by morgan output, loglevel set to info
logger.stream = {
  write: function (message, encoding) {
    logger.info(message)
  }
}

let httpLogger = null

if (config.isDevEnv) {
  // dev mode: all output to console
  logger.add(new winston.transports.Console())
  httpLogger = morgan('dev')
} else {
  // production mode: save log to file as console is not available
  // TODO: Implement log file that is limited (winston-daily-rotate-file). Now it may expand inifitely.
  logger.add(new winston.transports.File({
    level: 'error',
    filename: path.join(logDirectory, 'error.log')
  }))
  // redirect morgan output to winston (ie file) and only severe http errors (500)
  httpLogger = morgan('common', {
    stream: logger.stream,
    skip: function (req, res) { return res.statusCode < 500 }
  })
}

module.exports = { logger, httpLogger }
