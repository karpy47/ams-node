const { DeviceEvent } = require('../db/models')
const { ac, resources } = require('../middleware/authorization')
const { NotGrantedError, NotFoundError, InternalError } = require('../helpers/httpErrors')
const { getValidationError } = require('../helpers/validation')
const _ = require('lodash')

async function readAll (req, res, next) {
  const permAny = ac.can(req.authUser.role).readAny(resources.deviceEvents)
  // TODO: examine pagination for getall-functions
  const { limit = 500 } = req.query
  const options = { limit }
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const deviceEvents = await DeviceEvent.findAll(options)
    res.status(200).json(deviceEvents)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function read (req, res, next) {
  const { deviceEventId } = req.params
  const permAny = ac.can(req.authUser.role).readAny(resources.deviceEvents)
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const deviceEvent = await DeviceEvent.findByPk(deviceEventId)
    if (!deviceEvent) return next(NotFoundError())
    res.status(200).json(deviceEvent)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function create (req, res, next) {
  const error = getValidationError(req)
  if (error) return next(error)

  const permAny = ac.can(req.authUser.role).readAny(resources.deviceEvents)
  const allowed = ['type', 'value', 'timestamp']
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const deviceEvent = await DeviceEvent.create(_.pick(req.body, allowed))
    res.status(201).json(deviceEvent)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function update (req, res, next) {
  const { deviceEventId } = req.params
  const permAny = ac.can(req.authUser.role).readAny(resources.deviceEvents)
  const allowed = ['type', 'value', 'timestamp']
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const deviceEvent = await DeviceEvent.findByPk(deviceEventId)
    if (!deviceEvent) return next(NotFoundError())
    deviceEvent.set(_.pick(req.body, allowed))
    await deviceEvent.save()
    res.status(200).json(deviceEvent)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function destroy (req, res, next) {
  const { deviceEventId } = req.params
  const permAny = ac.can(req.authUser.role).createAny(resources.devices)
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const deviceEvent = await DeviceEvent.findByPk(deviceEventId)
    if (!deviceEvent) return next(NotFoundError())
    await deviceEvent.destroy()
    res.status(200).json({ id: deviceEvent.id })
  } catch (err) {
    return next(InternalError(err))
  }
}

module.exports = {
  readAll, read, create, update, destroy
}
