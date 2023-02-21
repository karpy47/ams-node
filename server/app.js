// load .env and config
require('dotenv').config()
const config = require('./config')
process.env.FORCE_COLOR = 1 // force to color mode

const express = require('express')
const path = require('path')
const compression = require('compression')
const cors = require('cors')
const routesClientV1 = require('./routes/api-client-v1')
const routesAppV1 = require('./routes/api-app-v1')
const { IllegalRequestError } = require('./helpers/httpErrors')

// setup express app
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(compression()) // setup compression of repsonse
app.use(cors())
// TODO: cors only for client api

// setup logging
const { logger, httpLogger } = require('./helpers/loggers')
app.use(httpLogger)

// setup routers
app.use('/client/v1', routesClientV1)
app.use('/app/v1', routesAppV1)

// url catch all (=404) and forward to error handler
app.use(function (req, res, next) {
  next(IllegalRequestError())
})

// catch all error handler
app.use(function (err, req, res, next) {
  const errorMessage = { status: err.status, message: err.message }
  // show error stack trace in dev mode
  if (config.isDevEnv) errorMessage.stack = err.stack
  res.status(err.status || 500).send(errorMessage)
  logger.error(errorMessage)
})

module.exports = app
