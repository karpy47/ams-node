const config = require('../../../config')
const app = require('../../../app')
const testApp = require('supertest')(app)
const { User } = require('../../../db/models')
const { createUser, createUserGroup } = require('../../../tests/helpers/seeder')
const apiBase = '/client/v1'

let group1, group2
let user1, admin1, superUser1, superAdmin1
let user2, admin2, superAdmin2

beforeAll(async () => {
  group1 = await createUserGroup()
  group2 = await createUserGroup()
  user1 = await createUser(config.roles.user, group1.id)
  admin1 = await createUser(config.roles.admin, group1.id)
  superUser1 = await createUser(config.roles.superUser, group1.id)
  superAdmin1 = await createUser(config.roles.superAdmin, group1.id)
  user2 = await createUser(config.roles.user, group2.id)
  admin2 = await createUser(config.roles.admin, group2.id)
  superAdmin2 = await createUser(config.roles.superAdmin, group2.id)
})

// Don't use supertest .expect (gives linter error and not proper stack trace?)
// https://github.com/jest-community/eslint-plugin-jest/issues/418

describe(`# GET ${apiBase}/users/:userId`, () => {
  test('not using bearer-auth should report not authorized', async () => {
    const res = await testApp.get(`${apiBase}/users`)
    expect(res.statusCode).toBe(401)
  })

  test('fetching a user should report user', async () => {
    const res = await testApp
      .get(`${apiBase}/users/${user1.id}`)
      .set('Authorization', 'Bearer ' + user1.accessToken)
    expect(res.statusCode).toBe(200)
    // check api response
    expect(res.body.id).toBe(user1.id)
    expect(res.body.name).toBe(user1.name)
    expect(res.body.email).toBe(user1.email)
    expect(res.body.password).toBeUndefined()
    expect(res.body.accessToken).toBeUndefined()
    expect(res.body.refreshToken).toBeUndefined()
    expect(res.body.resetPasswordToken).toBeUndefined()
    // check database
    const dbUser = await User.findOne({ where: { id: res.body.id } })
    expect(dbUser).toBeTruthy()
    expect(dbUser.name).toBe(user1.name)
    expect(dbUser.email).toBe(user1.email)
  })

  test('fetching an unknown user should report not found', async () => {
    const res = await testApp
      .get(`${apiBase}/users/12345`)
      .set('Authorization', 'Bearer ' + user1.accessToken)
    expect(res.statusCode).toBe(404)
  })

  test('user-role may see admin-role in same group', async () => {
    const res = await testApp
      .get(`${apiBase}/users/${admin1.id}`)
      .set('Authorization', 'Bearer ' + user1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(admin1.id)
  })

  test('admin-role may NOT see user-role in other group', async () => {
    const res = await testApp
      .get(`${apiBase}/users/${user2.id}`)
      .set('Authorization', 'Bearer ' + admin1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('superuser-role may see any superadmin', async () => {
    const res = await testApp
      .get(`${apiBase}/users/${superAdmin2.id}`)
      .set('Authorization', 'Bearer ' + superUser1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(superAdmin2.id)
  })
})

describe(`# DELETE ${apiBase}/users/:userId`, () => {
  let tempUser1 = {}
  let tempSuperAdmin2 = {}

  beforeAll(async () => {
    tempUser1 = await createUser(config.roles.user, admin1.userGroupId)
    tempSuperAdmin2 = await createUser(config.roles.superAdmin, admin1.userGroupId)
  })

  test('deleting an unknown user should report not found', async () => {
    const res = await testApp
      .delete(`${apiBase}/users/12345`)
      .set('Authorization', 'Bearer ' + admin1.accessToken)
    expect(res.statusCode).toBe(404)
  })

  test('user-role may NOT delete a user', async () => {
    const res = await testApp
      .delete(`${apiBase}/users/${tempUser1.id}`)
      .set('Authorization', 'Bearer ' + user1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('admin-role may NOT delete user in other group', async () => {
    const res = await testApp
      .delete(`${apiBase}/users/${tempUser1.id}`)
      .set('Authorization', 'Bearer ' + admin2.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('admin-role may delete user in same group', async () => {
    const res = await testApp
      .delete(`${apiBase}/users/${tempUser1.id}`)
      .set('Authorization', 'Bearer ' + admin1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(tempUser1.id)
  })

  test('superuser-role may NOT delete superadmin', async () => {
    const res = await testApp
      .delete(`${apiBase}/users/${tempSuperAdmin2.id}`)
      .set('Authorization', 'Bearer ' + superUser1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('superadmin-role may delete superadmin', async () => {
    const res = await testApp
      .delete(`${apiBase}/users/${tempSuperAdmin2.id}`)
      .set('Authorization', 'Bearer ' + superAdmin1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(tempSuperAdmin2.id)
  })
})
