const AccessControl = require('accesscontrol')
const roles = require('../../config').roles

export const resources = {
  users: 'Users',
  userGroups: 'UserGroup',
  devices: 'Devices',
  deviceEvents: 'DeviceEvents',
  patients: 'Patients',
  clinics: 'Clinics'
}
const r = resources

const allowedRoleAssigns = []
allowedRoleAssigns[roles.user] = []
allowedRoleAssigns[roles.admin] = [roles.user, roles.admin]
allowedRoleAssigns[roles.superUser] = [roles.user, roles.admin]
allowedRoleAssigns[roles.superAdmin] = [roles.factory, roles.user, roles.admin, roles.superUser, roles.superAdmin]

export const ac = new AccessControl()

// Note! For user and admin roles, 'own' means the own group (defined by UserGroup)
ac.grant(roles.user)
  .readOwn(r.users)
  .readOwn(r.userGroups)
  .createOwn(r.patients).readOwn(r.patients).updateOwn(r.patients)
  .readOwn(r.clinics)

ac.grant(roles.admin).extend(roles.user)
  .createOwn(r.users).updateOwn(r.users).deleteOwn(r.users)
  .deleteOwn(r.patients)
  .createOwn(r.clinics).updateOwn(r.clinics).deleteOwn(r.clinics)

ac.grant(roles.superUser)
  .createAny(r.users).readAny(r.users).updateAny(r.users).deleteAny(r.users)
  .createAny(r.userGroups).readAny(r.userGroups).updateAny(r.userGroups)
  .createAny(r.devices).readAny(r.devices).updateAny(r.devices)
  .readAny(r.deviceEvents)
  .readAny(r.patients)
  .createAny(r.clinics).updateAny(r.clinics).readAny(r.clinics).deleteAny(r.clinics)

ac.grant(roles.superAdmin).extend(roles.superUser)
  .deleteAny(r.userGroups)
  .deleteAny(r.devices)
  .createAny(r.deviceEvents).updateAny(r.deviceEvents).deleteAny(r.deviceEvents)
  .createAny(r.patients).updateAny(r.patients).deleteAny(r.patients)

ac.grant(roles.factory)
  .createAny(r.devices).readAny(r.devices).updateAny(r.devices).deleteAny(r.devices)

// Locks accesscontrol, no additions later on in code
ac.lock()

