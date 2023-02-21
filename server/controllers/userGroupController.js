const { UserGroup } = require('../db/models')
const { ac, resources } = require('../middleware/authorization')
const { NotGrantedError, NotFoundError, InternalError } = require('../helpers/httpErrors')
const { getValidationError } = require('../helpers/validation')
const _ = require('lodash')

async function readAll (req, res, next) {
  const permission = ac.can(req.authUser.role).readAny(resources.userGroups)
  if (!permission.granted) return next(NotGrantedError())

  // TODO: examine pagination for getall-functions
  const { limit = 500 } = req.query
  const options = { limit: limit }
  try {
    const usergroups = await UserGroup.findAll(options)
    res.status(200).json(usergroups)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function read (req, res, next) {
  const { userGroupId } = req.params

  try {
    const userGroup = await UserGroup.findByPk(userGroupId)
    if (!userGroup) return next(NotFoundError())

    const permission = (req.authUser.userGroupId === userGroup.id)
      ? ac.can(req.authUser.role).readOwn(resources.userGroups)
      : ac.can(req.authUser.role).readAny(resources.userGroups)
    if (!permission.granted) return next(NotGrantedError())

    res.status(200).json(userGroup)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function create (req, res, next) {
  const error = getValidationError(req)
  if (error) return next(error)

  const permission = ac.can(req.authUser.role).createAny(resources.userGroups)
  if (!permission.granted) return next(NotGrantedError())

  const allowed = ['name', 'description']
  try {
    const createdUserGroup = await UserGroup.create(_.pick(req.body, allowed))
    res.status(201).json(createdUserGroup)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function update (req, res, next) {
  const { userGroupId } = req.params
  const allowed = ['name', 'description']

  try {
    const permission = ac.can(req.authUser.role).updateAny(resources.userGroups)
    if (!permission.granted) return next(NotGrantedError())

    const userGroup = await UserGroup.findByPk(userGroupId)
    if (!userGroup) return next(NotFoundError())

    userGroup.set(_.pick(req.body, allowed))
    await userGroup.save()
    res.status(200).json(userGroup)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function destroy (req, res, next) {
  const { userGroupId } = req.params
  try {
    const permission = ac.can(req.authUser.role).deleteAny(resources.userGroups)
    if (!permission.granted) return next(NotGrantedError())

    const userGroup = await UserGroup.findByPk(userGroupId)
    if (!userGroup) return next(NotFoundError())

    await userGroup.destroy()
    res.status(200).json({ id: userGroup.id })
  } catch (err) {
    return next(InternalError(err))
  }
}

module.exports = {
  readAll, read, create, update, destroy
}
