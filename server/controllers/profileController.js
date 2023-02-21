const { Patient, Device, AuditLog } = require('../db/models')
const { NotFoundError, InternalError } = require('../helpers/httpErrors')
const { getValidationError } = require('../helpers/validation')
const _ = require('lodash')
const config = require('../config')

async function readProfile (req, res, next) {
  const patientId = req.authPatient.id
  try {
    const patient = await Patient.scope('fullProfile').findByPk(patientId)
    if (!patient) return next(NotFoundError())
    res.status(200).json(patient)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function updateProfile (req, res, next) {
  const error = getValidationError(req)
  if (error) return next(error)

  const patientId = req.authPatient.id
  const allowed = ['firstname', 'lastname', 'address1', 'address2', 'postcode', 'city', 'country', 'personalId', 'email', 'phone', 'gender', 'birthDate', 'password', 'comment']
  try {
    const patient = await Patient.scope('fullProfile').findByPk(patientId)
    if (!patient && !config.logic.createDeviceIfNotFound) return next(NotFoundError())
    patient.set(_.pick(req.body, allowed))
    await patient.save()
    AuditLog.logUpdate(patient, { patientId: req.authPatient.id })
    res.status(200).json(patient)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function destroyProfile (req, res, next) {
  const patientId = req.authPatient.id
  try {
    const patient = await Patient.findByPk(patientId)
    if (!patient) return next(NotFoundError())
    await patient.destroy()
    AuditLog.logDelete(patient, { patientId: req.authPatient.id })
    res.status(200).json({ id: patient.id })
  } catch (err) {
    return next(InternalError(err))
  }
}

async function createProfileDevice (req, res, next) {
  const error = getValidationError(req)
  if (error) return next(error)

  const patient = req.authPatient
  const allowed = ['serialNo', 'batchNo']
  try {
    let device = await Device.findOne({ where: { serialNo: req.body.serialNo } })
    if (!device) {
      if (config.logic.createDeviceIfNotFound) {
        device = await Device.create(_.pick(req.body, allowed))
      } else {
        return next(NotFoundError())
      }
    }
    patient.deviceId = device.id
    await patient.save()
    AuditLog.logUpdate(patient, { patientId: req.authPatient.id })
    res.status(201).json(device)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function readProfileDevice (req, res, next) {
  const patient = req.authPatient
  if (!patient.deviceId) return next(NotFoundError())
  try {
    const device = await Device.findByPk(patient.deviceId)
    if (!device) return next(NotFoundError())
    res.status(200).json(device)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function deleteProfileDevice (req, res, next) {
  const patient = req.authPatient
  if (!patient.deviceId) return next(NotFoundError())
  try {
    patient.deviceId = null
    await patient.save()
    AuditLog.logDelete(patient, { patientId: req.authPatient.id })
    res.status(200).json({})
  } catch (err) {
    return next(InternalError(err))
  }
}

module.exports = {
  readProfile, updateProfile, destroyProfile, readProfileDevice, createProfileDevice, deleteProfileDevice
}
