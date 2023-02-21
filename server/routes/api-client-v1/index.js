const router = require('express').Router()
const Passport = require('passport').Passport
const bearerStrategy = require('./bearerStrategy')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerOptions = require('./swaggerOptions.js')
const swaggerUI = require('swagger-ui-express')
const { IllegalRequestError } = require('../../helpers/httpErrors')

// public routes below
router.get('/ping', (req, res) => res.json({ desc: 'Client API v1', pingAt: new Date() }))

const swaggerJson = swaggerJsDoc(swaggerOptions)
router.use('/docs', swaggerUI.serveFiles(swaggerJson))
router.get('/docs', swaggerUI.setup(swaggerJson, { explorer: true }))
router.get('/docs/json', (req, res) => res.json(swaggerJson))
router.use('/auth', require('./authPublicRoutes'))

// initiate authentication
// https://stackoverflow.com/questions/25896753/passportjs-using-multiple-passports-within-express-application
const passport = new Passport()
passport.use(bearerStrategy)
const bearerOptions = { session: false, assignProperty: 'authUser' }
router.use('/', passport.authenticate('bearer', bearerOptions))

// private and authenticated routes below
router.use('/auth', require('./authRoutes'))
router.use('/users', require('./userRoutes'))
router.use('/user-groups', require('./userGroupRoutes'))
router.use('/devices', require('./deviceRoutes'))
router.use('/device-events', require('./deviceEventRoutes'))
router.use('/components', require('./componentRoutes'))
router.use('/clinics', require('./clinicRoutes'))
router.use('/patients', require('./patientRoutes'))
// router.use('/audit-log', require('./auditLogRoutes'))
// router.use('/event-log', require('./eventLogRoutes'))

// default error handler if no routes match
router.use('/', (req, res) => { throw (IllegalRequestError()) })

module.exports = router
