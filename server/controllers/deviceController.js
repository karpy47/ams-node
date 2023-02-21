const { Device } = require('../db/models')
const { ac, resources } = require('../middleware/authorization')
const { NotGrantedError, NotFoundError, InternalError } = require('../helpers/httpErrors')
const { getValidationError } = require('../helpers/validation')
const _ = require('lodash')

async function readAll (req, res, next) {
  const permAny = ac.can(req.authUser.role).readAny(resources.devices)
  // TODO: examine pagination for getall-functions
  const { limit = 500 } = req.query
  const options = { limit: limit }
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const devices = await Device.findAll(options)
    res.status(200).json(devices)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function read (req, res, next) {
  const { deviceId } = req.params
  const permAny = ac.can(req.authUser.role).readAny(resources.devices)
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const device = await Device.findByPk(deviceId)
    if (!device) return next(NotFoundError())
    res.status(200).json(device)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function create (req, res, next) {
  const error = getValidationError(req)
  if (error) return next(error)

  const permAny = ac.can(req.authUser.role).createAny(resources.devices)
  const allowed = ['serialNo', 'batchNo', 'manufacturedAt', 'firstUseAt', 'lastUseAt']
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const device = await Device.create(_.pick(req.body, allowed))
    res.status(201).json(device)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function update (req, res, next) {
  const { deviceId } = req.params
  const permAny = ac.can(req.authUser.role).createAny(resources.devices)
  const allowed = ['serialNo', 'batchNo', 'manufacturedAt', 'firstUseAt', 'lastUseAt']
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const device = await Device.findByPk(deviceId)
    if (!device) return next(NotFoundError())
    device.set(_.pick(req.body, allowed))
    await device.save()
    res.status(200).json(device)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function destroy (req, res, next) {
  const { deviceId } = req.params
  const permAny = ac.can(req.authUser.role).createAny(resources.devices)
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const device = await Device.findByPk(deviceId)
    if (!device) return next(NotFoundError())
    await device.destroy()
    res.status(200).json({ id: device.id })
  } catch (err) {
    return next(InternalError(err))
  }
}

module.exports = {
  readAll, read, create, update, destroy
}
