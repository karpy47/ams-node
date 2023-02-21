const config = require('../../../config')
const app = require('../../../app')
const testApp = require('supertest')(app)
const { User } = require('../../../db/models')
const { createUser, createUserGroup } = require('../../../tests/helpers/seeder')
const apiBase = '/client/v1'

let group1, user1, anotherUser1

beforeAll(async () => {
  group1 = await createUserGroup()
  user1 = await createUser(config.roles.user, group1.id)
  anotherUser1 = await createUser(config.roles.user, user1.userGroupId)
})

// Don't use supertest .expect (gives linter error and not proper stack trace?)
// https://github.com/jest-community/eslint-plugin-jest/issues/418

describe(`# POST ${apiBase}/auth/login`, () => {
  test('login without password should fail validation', async () => {
    const res = await testApp
      .post(`${apiBase}/auth/login`)
      .send({ email: anotherUser1.email })
    expect(res.statusCode).toBe(422)
  })

  test('login with wrong password should report not authorized', async () => {
    const res = await testApp
      .post(`${apiBase}/auth/login`)
      .send({ email: anotherUser1.email, password: 'not_valid' })
    expect(res.statusCode).toBe(401)
  })

  test('correct login should return tokens', async () => {
    const res = await testApp
      .post(`${apiBase}/auth/login`)
      .send({ email: anotherUser1.email, password: 'pwd' })
    expect(res.statusCode).toBe(200)
    expect(res.body.accessToken).toContain('.')
    expect(res.body.accessToken).toHaveLength(31)
    expect(res.body.accessTokenExpiresIn).toBeDefined()
    expect(res.body.refreshToken).toContain('.')
    expect(res.body.refreshToken).toHaveLength(31)
    expect(res.body.refreshTokenExpiresIn).toBeDefined()
    // compare database and api response
    expect(res.body.id).toBe(anotherUser1.id)
    anotherUser1 = await User.findByPk(res.body.id)
    expect(anotherUser1).toBeTruthy()
    expect(anotherUser1.accessToken).toBe(res.body.accessToken)
    expect(anotherUser1.refreshToken).toBe(res.body.refreshToken)
  })
})

describe(`# GET ${apiBase}/auth/user`, () => {
  test('logged in user should read his own data', async () => {
    const res = await testApp
      .get(`${apiBase}/auth/user`)
      .set('Authorization', 'Bearer ' + anotherUser1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(anotherUser1.id)
    expect(res.body.name).toBe(anotherUser1.name)
    expect(res.body.email).toBe(anotherUser1.email)
  })
})

describe(`# POST ${apiBase}/auth/refresh`, () => {
  test('logged in user should NOT get new tokens without valid refreshtoken', async () => {
    const res = await testApp
      .post(`${apiBase}/auth/refresh`)
      .send({ id: anotherUser1.id, refreshToken: 'invalid_token' })
    expect(res.statusCode).toBe(401)
  })

  test('logged in user should get new tokens on refresh', async () => {
    const res = await testApp
      .post(`${apiBase}/auth/refresh`)
      .send({ id: anotherUser1.id, refreshToken: anotherUser1.refreshToken })
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(anotherUser1.id)
    expect(res.body.accessToken).toContain('.')
    expect(res.body.accessToken).toHaveLength(31)
    expect(res.body.accessTokenExpiresIn).toBeDefined()
    expect(res.body.refreshToken).toContain('.')
    expect(res.body.refreshToken).toHaveLength(31)
    expect(res.body.refreshTokenExpiresIn).toBeDefined()
    // save new tokens for later attempts
    anotherUser1.accessToken = res.body.accessToken
    anotherUser1.refreshToken = res.body.refreshToken
  })
})

describe(`# GET ${apiBase}/auth/logout`, () => {
  let oldAccessToken = null

  test('after user logout all tokens should be removed', async () => {
    const res = await testApp
      .get(`${apiBase}/auth/logout`)
      .set('Authorization', 'Bearer ' + anotherUser1.accessToken)
    expect(res.statusCode).toBe(200)
    // check in database
    oldAccessToken = anotherUser1.accessToken
    anotherUser1 = await User.findByPk(anotherUser1.id)
    expect(anotherUser1).toBeTruthy()
    expect(anotherUser1.accessToken).toBeNull()
    expect(anotherUser1.refreshToken).toBeNull()
  })

  test('after user logout, the accesstoken is not valid', async () => {
    const res = await testApp
      .get(`${apiBase}/auth/user`)
      .set('Authorization', 'Bearer ' + oldAccessToken)
    expect(res.statusCode).toBe(401)
  })
})
