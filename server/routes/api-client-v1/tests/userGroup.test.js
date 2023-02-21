const config = require('../../../config')
const app = require('../../../app')
const testApp = require('supertest')(app)
const { UserGroup } = require('../../../db/models')
const { createUser, createUserGroup } = require('../../../tests/helpers/seeder')
const apiBase = '/client/v1'

let group1, group2
let user1, admin1, superUser1, superAdmin1

beforeAll(async () => {
  group1 = await createUserGroup()
  group2 = await createUserGroup()
  user1 = await createUser(config.roles.user, group1.id)
  admin1 = await createUser(config.roles.admin, group1.id)
  superUser1 = await createUser(config.roles.superUser, group1.id)
  superAdmin1 = await createUser(config.roles.superAdmin, group1.id)
})

describe(`# GET ${apiBase}/user-groups/:userGroupId`, () => {
  test('not using bearer-auth should report not authorized', async () => {
    const res = await testApp.get(`${apiBase}/user-groups`)
    expect(res.statusCode).toBe(401)
  })

  test('fetching a usergroup should report usergroup', async () => {
    const res = await testApp
      .get(`${apiBase}/user-groups/${group1.id}`)
      .set('Authorization', 'Bearer ' + user1.accessToken)
    expect(res.statusCode).toBe(200)
    // check api response
    expect(res.body.id).toBe(group1.id)
    expect(res.body.name).toBe(group1.name)
    expect(res.body.description).toBe(group1.description)
    // check database
    const dbUserGroup = await UserGroup.findByPk(res.body.id)
    expect(dbUserGroup).toBeTruthy()
    expect(dbUserGroup.name).toBe(group1.name)
    expect(dbUserGroup.description).toBe(group1.description)
  })

  test('fetching an unknown usergroup should report not found', async () => {
    const res = await testApp
      .get(`${apiBase}/user-groups/12345`)
      .set('Authorization', 'Bearer ' + user1.accessToken)
    expect(res.statusCode).toBe(404)
  })

  test('user-role may NOT see other usergroups', async () => {
    const res = await testApp
      .get(`${apiBase}/user-groups/${group2.id}`)
      .set('Authorization', 'Bearer ' + user1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('admin-role may NOT see other usergroups', async () => {
    const res = await testApp
      .get(`${apiBase}/user-groups/${group2.id}`)
      .set('Authorization', 'Bearer ' + admin1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('superuser-role may see other usergroups', async () => {
    const res = await testApp
      .get(`${apiBase}/user-groups/${group2.id}`)
      .set('Authorization', 'Bearer ' + superUser1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(group2.id)
  })
})

describe(`# POST ${apiBase}/user-groups`, () => {
  test('not using bearer-auth should report not authorized', async () => {
    const res = await testApp.post(`${apiBase}/user-groups`)
    expect(res.statusCode).toBe(401)
  })

  test('user-role may NOT create an usergroup', async () => {
    const res = await testApp
      .post(`${apiBase}/user-groups/`)
      .send({ name: 'Not allowed usergroup' })
      .set('Authorization', 'Bearer ' + user1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('admin-role may NOT create an usergroup', async () => {
    const res = await testApp
      .post(`${apiBase}/user-groups/`)
      .send({ name: 'Not allowed usergroup' })
      .set('Authorization', 'Bearer ' + admin1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('superuser-role may create an usergroup', async () => {
    const data = { name: 'New usergroup', description: 'Desc of usergroup' }
    const res = await testApp
      .post(`${apiBase}/user-groups/`)
      .send(data)
      .set('Authorization', 'Bearer ' + superUser1.accessToken)
    expect(res.statusCode).toBe(201)
    // check api response
    expect(res.body.name).toBe(data.name)
    expect(res.body.description).toBe(data.description)
    // check database
    const dbUserGroup = await UserGroup.findByPk(res.body.id)
    expect(dbUserGroup).toBeTruthy()
    expect(dbUserGroup.name).toBe(data.name)
    expect(dbUserGroup.description).toBe(data.description)
  })
})

describe(`# PUT ${apiBase}/user-groups/:userGroupId`, () => {
  test('not using bearer-auth should report not authorized', async () => {
    const res = await testApp.put(`${apiBase}/user-groups/${group2.id}`)
    expect(res.statusCode).toBe(401)
  })

  test('user-role may NOT update an usergroup', async () => {
    const res = await testApp
      .put(`${apiBase}/user-groups/${group2.id}`)
      .send({ name: 'No change allowed' })
      .set('Authorization', 'Bearer ' + user1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('admin-role may NOT update an usergroup', async () => {
    const res = await testApp
      .put(`${apiBase}/user-groups/${group2.id}`)
      .send({ name: 'No change allowed' })
      .set('Authorization', 'Bearer ' + admin1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('superuser-role may update an usergroup', async () => {
    const data = { name: 'Changed name of usergroup', description: 'Changed desc of usergroup' }
    const res = await testApp
      .put(`${apiBase}/user-groups/${group2.id}`)
      .send(data)
      .set('Authorization', 'Bearer ' + superUser1.accessToken)
    expect(res.statusCode).toBe(200)
    // check api response
    expect(res.body.name).toBe(data.name)
    expect(res.body.description).toBe(data.description)
    // check database
    const dbUserGroup = await UserGroup.findOne({ where: { id: res.body.id } })
    expect(dbUserGroup).toBeTruthy()
    expect(dbUserGroup.name).toBe(data.name)
    expect(dbUserGroup.description).toBe(data.description)
  })
})

describe(`# DELETE ${apiBase}/user-groups/:userGroupId`, () => {
  let unrelatedGroup

  beforeAll(async () => {
    unrelatedGroup = await createUserGroup()
  })

  test('user-role may NOT delete a usergroup', async () => {
    const res = await testApp
      .delete(`${apiBase}/user-groups/${group1.id}`)
      .set('Authorization', 'Bearer ' + user1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('admin-role may NOT delete a usergroup', async () => {
    const res = await testApp
      .delete(`${apiBase}/user-groups/${group1.id}`)
      .set('Authorization', 'Bearer ' + admin1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('superuser-role may NOT delete a usergroup', async () => {
    const res = await testApp
      .delete(`${apiBase}/user-groups/${group1.id}`)
      .set('Authorization', 'Bearer ' + superUser1.accessToken)
    expect(res.statusCode).toBe(403)
  })

  test('deleting an unknown usergroup should report not found', async () => {
    const res = await testApp
      .delete(`${apiBase}/user-groups/12345`)
      .set('Authorization', 'Bearer ' + superAdmin1.accessToken)
    expect(res.statusCode).toBe(404)
  })

  test('superadmin-role may delete any usergroup', async () => {
    const res = await testApp
      .delete(`${apiBase}/user-groups/${unrelatedGroup.id}`)
      .set('Authorization', 'Bearer ' + superAdmin1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(unrelatedGroup.id)
  })
})
