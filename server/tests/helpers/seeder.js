const { UserGroup, User, Patient } = require('../../db/models')

async function createUserGroup (data = {}) {
  return await UserGroup.create({
    name: data.name || 'Some usergroup',
    description: data.description || 'Created at ' + Date.now()
  })
}

async function createUser (role, groupId) {
  const user = User.build({
    name: 'Some ' + role,
    email: role + '.' + Date.now() + '@' + 'group.' + groupId + '.com',
    role: role,
    password: 'pwd',
    userGroupId: groupId
  })
  user.generateAccessToken()
  user.generateRefreshToken()
  return await user.save()
}

async function createPatient (genTokens = true) {
  const patient = Patient.build({
    firstname: 'Fname',
    lastname: 'Lname',
    password: 'pwd'
  })
  if (genTokens) {
    await patient.generateAccessToken()
    await patient.generateRefreshToken()
    await patient.generateActivationToken()
  }
  // save raw password as it will be hashed on save
  patient.rawPassword = patient.password
  return await patient.save()
}

module.exports = { createUserGroup, createUser, createPatient }
