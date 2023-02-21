const { User, AuditLog } = require('../db/models')
const { ac, resources, allowedRoleAssigns } = require('../middleware/authorization')
const { NotGrantedError, InsufficientRoleError, NotFoundError, InternalError } = require('../helpers/httpErrors')
const { getValidationError } = require('../helpers/validation')
const _ = require('lodash')

async function readAll (req, res, next) {
  const permOwn = ac.can(req.authUser.role).readOwn(resources.users)
  const permAny = ac.can(req.authUser.role).readAny(resources.users)
  // TODO: examine pagination for getall-functions
  const { limit = 500 } = req.query
  const { userGroupId = null } = req.authUser
  const options = { limit }
  try {
    if (permAny.granted) {
      // do nothing
    } else if (permOwn.granted) {
      options.where = { userGroupId }
    } else {
      return next(NotGrantedError())
    }
    const users = await User.scope('showUserGroup').findAll(options)
    res.status(200).json(users)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function read (req, res, next) {
  const { userId } = req.params
  const permOwn = ac.can(req.authUser.role).readOwn(resources.users)
  const permAny = ac.can(req.authUser.role).readAny(resources.users)

  try {
    const user = await User.scope('showUserGroup').findByPk(userId)
    if (!user) return next(NotFoundError())
    if (permAny.granted || ((req.authUser.userGroupId === user.userGroupId) && permOwn.granted)) {
      res.status(200).json(user)
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

  const permOwn = ac.can(req.authUser.role).createOwn(resources.users)
  const permAny = ac.can(req.authUser.role).createAny(resources.users)
  const allowedOwn = ['name', 'email', 'phone', 'password']
  const allowedAny = ['status', 'name', 'email', 'phone', 'role', 'password', 'userGroupId', 'autoLogoutAfter']

  // use auth's usergroupid if not explicitly set in request
  if (!req.body.userGroupId) req.body.userGroupId = req.authUser.userGroupId

  // check if auth user allowed to create another user with different role
  if (!allowedRoleAssigns[req.authUser.role].includes(req.body.role)) {
    return next(InsufficientRoleError())
  }

  try {
    let allowed = []
    if (permAny.granted) {
      allowed = allowedAny
    } else if (permOwn.granted && (req.authUser.userGroupId === req.body.userGroupId)) {
      allowed = allowedOwn
    } else {
      return next(NotGrantedError())
    }
    const user = await User.create(_.pick(req.body, allowed))
    AuditLog.logCreate(user, { userId: req.authUser.id })
    res.status(201).json(user)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function update (req, res, next) {
  const error = getValidationError(req)
  if (error) return next(error)

  const { userId } = req.params
  const permOwn = ac.can(req.authUser.role).updateOwn(resources.users)
  const permAny = ac.can(req.authUser.role).updateAny(resources.users)
  const allowedOwn = ['name', 'email', 'phone', 'password']
  const allowedAny = ['status', 'name', 'email', 'phone', 'role', 'password', 'userGroupId', 'autoLogoutAfter']

  try {
    const user = await User.findByPk(userId)
    if (!user) return next(NotFoundError())
    if (permAny.granted) {
      user.set(_.pick(req.body, allowedAny))
    } else if (permOwn.granted && (req.authUser.userGroupId === user.userGroupId)) {
      user.set(_.pick(req.body, allowedOwn))
    } else {
      return next(NotGrantedError())
    }
    // check if auth user allowed to change user with different role
    if (!allowedRoleAssigns[req.authUser.role].includes(user.role)) {
      return next(InsufficientRoleError())
    }
    await user.save()
    AuditLog.logUpdate(user, { userId: req.authUser.id })
    res.status(200).json(user)
  } catch (err) {
    return next(InternalError(err))
  }
}

async function destroy (req, res, next) {
  const { userId } = req.params
  const permOwn = ac.can(req.authUser.role).deleteOwn(resources.users)
  const permAny = ac.can(req.authUser.role).deleteAny(resources.users)
  try {
    const user = await User.findByPk(userId)
    if (!user) return next(NotFoundError())
    if (permAny.granted || ((req.authUser.userGroupId === user.userGroupId) && permOwn.granted)) {
      // check if auth user allowed to change user with different role
      if (!allowedRoleAssigns[req.authUser.role].includes(user.role)) {
        return next(InsufficientRoleError())
      }
      await user.destroy()
      AuditLog.logDelete(user, { userId: req.authUser.id })
      res.status(200).json({ id: user.id })
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
