const { Clinic } = require('../db/models')
const { ac, resources } = require('../middleware/authorization')
const { NotGrantedError, NotFoundError, InternalError } = require('../helpers/httpErrors')
const { getValidationError } = require('../helpers/validation')
const _ = require('lodash')

async function readAll (req, res, next) {
  const permOwn = ac.can(req.authUser.role).readOwn(resources.clinics)
  const permAny = ac.can(req.authUser.role).readAny(resources.clinics)
  // TODO: examine pagination for getall-functions
  const { limit = 500 } = req.query
  const { userGroupId = null } = req.authUser
  const options = { limit: limit }
  try {
    if (permAny.granted) {
      // do nothing
    } else if (permOwn.granted) {
      options.where = { userGroupId: userGroupId }
    } else {
      return next(NotGrantedError())
    }
    const clinics = await Clinic.scope('showUserGroup').findAll(options)
    res.status(200).json(clinics)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function read (req, res, next) {
  const { clinicId } = req.params
  const permOwn = ac.can(req.authUser.role).readOwn(resources.clinics)
  const permAny = ac.can(req.authUser.role).readAny(resources.clinics)

  try {
    const clinic = await Clinic.scope('showUserGroup').findByPk(clinicId)
    if (!clinic) return next(NotFoundError())
    if (permAny.granted || (permOwn.granted && (req.authUser.userGroupId === clinic.userGroupId))) {
      res.status(200).json(clinic)
    } else {
      return next(NotGrantedError())
    }
  } catch (err) {
    return next(InternalError(err))
  }
}

async function create (req, res, next) {
  const error = getValidationError(req)
  if (error) return next(error)

  const permOwn = ac.can(req.authUser.role).createOwn(resources.clinics)
  const permAny = ac.can(req.authUser.role).createAny(resources.clinics)
  const allowed = ['name', 'address1', 'address2', 'postcode', 'city', 'country', 'phone', 'email', 'openHours']

  // use auth's usergroupid if not explicitly set in request
  if (!req.body.userGroupId) req.body.userGroupId = req.authUser.userGroupId

  try {
    if (permAny.granted || ((req.authUser.userGroupId = req.body.userGroupId) && permOwn.granted)) {
      const clinic = await Clinic.create(_.pick(req.body, allowed))
      res.status(201).json(clinic)
    } else {
      return next(NotGrantedError())
    }
  } catch (err) {
    return next(InternalError(err))
  }
}

async function update (req, res, next) {
  const error = getValidationError(req)
  if (error) return next(error)

  const { clinicId } = req.params
  const permOwn = ac.can(req.authUser.role).updateOwn(resources.clinics)
  const permAny = ac.can(req.authUser.role).updateAny(resources.clinics)
  const allowed = ['name', 'address1', 'address2', 'postcode', 'city', 'country', 'phone', 'email', 'openHours']

  try {
    const clinic = await Clinic.findByPk(clinicId)
    if (!clinic) return next(NotFoundError())
    if (permAny.granted || ((req.authUser.userGroupId === clinic.userGroupId) && permOwn.granted)) {
      clinic.set(_.pick(req.body, allowed))
      await clinic.save()
      res.status(200).json(clinic)
    } else {
      return next(NotGrantedError())
    }
  } catch (err) {
    return next(InternalError(err))
  }
}

async function destroy (req, res, next) {
  const { clinicId } = req.params
  const permOwn = ac.can(req.authUser.role).deleteOwn(resources.clinics)
  const permAny = ac.can(req.authUser.role).deleteAny(resources.clinics)
  try {
    const clinic = await Clinic.findByPk(clinicId)
    if (!clinic) return next(NotFoundError())
    if (permAny.granted || ((req.authUser.userGroupId === clinic.userGroupId) && permOwn.granted)) {
      await clinic.destroy()
      res.status(200).json({ id: clinic.id })
    } else {
      return next(NotGrantedError())
    }
  } catch (err) {
    return next(InternalError(err))
  }
}

module.exports = {
  readAll, read, create, update, destroy
}
