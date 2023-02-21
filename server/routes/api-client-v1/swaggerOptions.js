const path = require('path')

module.exports = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Abilion Client API',
      description: 'REST API for web clients interacting with the backend',
      contact: {
        name: 'API support',
        email: 'support@abilion.com'
      },
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:3001/client/v1',
        description: 'Dev docker container'
      },
      {
        url: 'https://api.abilion.com/client/v1',
        description: 'Production server'
      }
    ],
    security: [
      { BearerAuth: [] }
    ],
    paths: {}
  },
  apis: [path.join(__dirname, '**/*.js')]
}

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: time-limited [accesstoken].[expire timestamp]
 */
