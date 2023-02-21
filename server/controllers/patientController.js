const { Patient, Clinic, AuditLog } = require('../db/models')
const { ac, resources } = require('../middleware/authorization')
const { NotGrantedError, NotFoundError, InternalError } = require('../helpers/httpErrors')
const { getValidationError } = require('../helpers/validation')
const _ = require('lodash')

async function readAll (req, res, next) {
  const permAny = ac.can(req.authUser.role).readAny(resources.patients)
  const permOwn = ac.can(req.authUser.role).readOwn(resources.patients)
  // TODO: examine pagination for getall-functions
  const { limit = 500 } = req.query
  const { userGroupId = null } = req.authUser
  const options = { limit: limit }
  try {
    if (permAny.granted) {
      // Nothing
    } else if (permOwn.granted) {
      options.include = { model: Clinic, where: { userGroupId: userGroupId } }
    } else {
      return next(NotGrantedError())
    }
    const patients = await Patient.findAll(options)
    res.status(200).json(patients)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function read (req, res, next) {
  const { patientId } = req.params
  const permAny = ac.can(req.authUser.role).readAny(resources.patients)
  const permOwn = ac.can(req.authUser.role).readOwn(resources.patients)

  try {
    const patient = await Patient.scope('showIncludes').findByPk(patientId)
    if (!patient) return next(NotFoundError())
    if (!permAny.granted && !(permOwn.granted && (patient.clinic.userGroupId === req.authUser.userGroupId))) {
      return next(NotGrantedError())
    }
    res.status(200).json(patient)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function create (req, res, next) {
  const error = getValidationError(req)
  if (error) return next(error)

  const permAny = ac.can(req.authUser.role).readAny(resources.patients)
  // const permOwn = ac.can(req.authUser.role).readOwn(resources.patients)
  const allowed = ['firstname', 'lastname', 'address1', 'address2', 'postcode', 'city', 'country', 'personalId', 'email', 'phone', 'gender', 'birthDate', 'comment']
  if (!permAny.granted) return next(NotGrantedError())
  try {
    const patient = await Patient.create(_.pick(req.body, allowed))
    AuditLog.logCreate(patient, { userId: req.authUser.id })
    res.status(201).json(patient)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function update (req, res, next) {
  const { patientId } = req.params
  const permAny = ac.can(req.authUser.role).readAny(resources.patients)
  // const permOwn = ac.can(req.authUser.role).readOwn(resources.patients)
  const allowed = ['firstname', 'lastname', 'address1', 'address2', 'postcode', 'city', 'country', 'personalId', 'email', 'phone', 'gender', 'birthDate', 'comment']

  try {
    const patient = await Patient.scope('showIncludes').findByPk(patientId)
    if (!patient) return next(NotFoundError())
    if (!permAny.granted) return next(NotGrantedError())
    patient.set(_.pick(req.body, allowed))
    await patient.save()
    AuditLog.logUpdate(patient, { userId: req.authUser.id })
    res.status(200).json(patient)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function destroy (req, res, next) {
  const { patientId } = req.params
  const permAny = ac.can(req.authUser.role).readAny(resources.patients)
  // const permOwn = ac.can(req.authUser.role).readOwn(resources.patients)
  try {
    const patient = await Patient.scope('showIncludes').findByPk(patientId)
    if (!patient) return next(NotFoundError())
    if (!permAny.granted) return next(NotGrantedError())
    await patient.destroy()
    AuditLog.logDelete(patient, { userId: req.authUser.id })
    res.status(200).json({ id: patient.id })
  } catch (err) {
    return next(InternalError(err))
  }
}

module.exports = {
  readAll, read, create, update, destroy
}
