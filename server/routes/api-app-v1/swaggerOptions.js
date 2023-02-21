const path = require('path')

module.exports = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Abilion App API',
      description: 'REST API for apps (mobiles/pads) interacting with the backend',
      contact: {
        name: 'API support',
        email: 'support@abilion.com'
      },
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:3001/app/v1',
        description: 'Dev docker container'
      },
      {
        url: 'https://api.abilion.com/app/v1',
        description: 'Production server'
      }
    ],
    paths: {}
  },
  apis: [path.join(__dirname, '**/*.js')]
}
