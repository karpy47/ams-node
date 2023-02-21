const app = require('./app')
const config = require('./config')
// const debug = require('debug')('server:server')
const http = require('http')
const chalk = require('chalk')

// Check database is there
const db = require('./db/models')
db.sequelize
  .authenticate()
  .then(() => {
    console.log(chalk.bgGreen('OK') + ' Database connection established successfully.')
  })
  .catch((err) => {
    console.error(chalk.bgRed('Error') + 'Unable to connect to database: ', err)
    process.exit(2)
  })

// Start HTTP server
const server = http.createServer(app)
const port = normalizePort(config.app.port)
server.listen(port) // Listen on all network interfaces
server.on('error', onError)
server.on('listening', onListening)

//  Normalize a port into a number, string, or false
function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) return val // named pipe
  if (port >= 0) return port // port number
  return false
}

// Event listener for HTTP server "error" event
function onError (error) {
  if (error.syscall !== 'listen') throw error

  const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(chalk.bgRed('Error: ') + ` ${bind} requires elevated privilege. Exiting...`)
      process.exit(1)
    case 'EADDRINUSE':
      console.error(chalk.bgRed('Error: ') + ` ${bind} is already in use. Exiting...`)
      process.exit(1)
    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event
function onListening () {
  let addr = server.address()
  let bind
  if (typeof addr === 'string') {
    bind = 'pipe ' + addr
  } else {
    bind = 'port ' + addr.port
    addr = addr.address
  }
  console.log(chalk.bgGreen('OK') + ` HTTP server now listening on ${addr} ${bind}.`)
}
