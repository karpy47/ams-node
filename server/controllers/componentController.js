const { Components } = require('../db/models')
const { ac, resources } = require('../middleware/authorization')
const { NotGrantedError, NotFoundError, InternalError } = require('../helpers/httpErrors')
const { getValidationError } = require('../helpers/validation')
const _ = require('lodash')

async function readAll (req, res, next) {
  const permAny = ac.can(req.authUser.role).readAny(resources.components)
  // TODO: examine pagination for getall-functions
  const { limit = 500 } = req.query
  const options = { limit }
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const components = await Components.findAll(options)
    res.status(200).json(components)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function read (req, res, next) {
  const { componentId } = req.params
  const permAny = ac.can(req.authUser.role).readAny(resources.components)
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const component = await Components.findByPk(componentId)
    if (!component) return next(NotFoundError())
    res.status(200).json(component)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function create (req, res, next) {
  const error = getValidationError(req)
  if (error) return next(error)

  const permAny = ac.can(req.authUser.role).createAny(resources.components)
  const allowed = ['dmCode', 'status', 'type', 'partRefNo', 'manufacturedAt', 'discardedAt', 'manufactureWiRefNo', 'signatureManufacturing', 'signatureInspection', 'poNumber', 'comment']
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const component = await Components.create(_.pick(req.body, allowed))
    res.status(201).json(component)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function update (req, res, next) {
  const { componentId } = req.params
  const permAny = ac.can(req.authUser.role).createAny(resources.components)
  const allowed = ['dmCode', 'status', 'type', 'partRefNo', 'manufacturedAt', 'discardedAt', 'manufactureWiRefNo', 'signatureManufacturing', 'signatureInspection', 'poNumber', 'comment']
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const component = await Components.findByPk(componentId)
    if (!component) return next(NotFoundError())
    Components.set(_.pick(req.body, allowed))
    await Components.save()
    res.status(200).json(component)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function destroy (req, res, next) {
  const { componentId } = req.params
  const permAny = ac.can(req.authUser.role).createAny(resources.components)
  try {
    if (!permAny.granted) return next(NotGrantedError())
    const component = await Components.findByPk(componentId)
    if (!component) return next(NotFoundError())
    await Components.destroy()
    res.status(200).json({ id: Components.id })
  } catch (err) {
    return next(InternalError(err))
  }
}

module.exports = {
  readAll, read, create, update, destroy
}
