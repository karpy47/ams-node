const app = require('../../../app')
const testApp = require('supertest')(app)
const { Patient } = require('../../../db/models')
const { createPatient } = require('../../../tests/helpers/seeder')
const apiBase = '/app/v1'

let patient0, patient1

beforeAll(async () => {
  patient0 = await createPatient(false)
  patient1 = await createPatient()
})

describe('# Default error handler', () => {
  test('unknown links should fail as not authenticated', async () => {
    const res = await testApp
      .post(`${apiBase}/unknown-link`)
    expect(res.statusCode).toBe(401)
  })
})

describe(`# POST ${apiBase}/auth/signup`, () => {
  test('signup without password should fail validation', async () => {
    const res = await testApp
      .post(`${apiBase}/auth/signup`)
      .send({ email: 'nopwd@email.com' })
    expect(res.statusCode).toBe(422)
  })

  test('signup with correct password should return id and save hashed', async () => {
    const res = await testApp
      .post(`${apiBase}/auth/signup`)
      .send({ password: 'somepwd' })
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBeDefined()
    // check in db
    const patient = await Patient.findByPk(res.body.id)
    expect(patient).toBeTruthy()
    expect(patient.password).not.toBe('somepwd')
    expect(patient.password).toContain('$')
    expect(patient.password).toHaveLength(60)
  })

  test('wrong login should return error', async () => {
    const res1 = await testApp
      .post(`${apiBase}/auth/login`)
      .send({ id: patient0.id, password: 'wrong-password' })
    expect(res1.statusCode).toBe(401)
  })

  test('correct login should return tokens', async () => {
    const res = await testApp
      .post(`${apiBase}/auth/login`)
      .send({ id: patient0.id, password: patient0.rawPassword })
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(patient0.id)
    expect(res.body.accessToken).toContain('.')
    expect(res.body.accessToken).toHaveLength(31)
    expect(res.body.accessTokenExpiresIn).toBeDefined()
    expect(res.body.refreshToken).toContain('.')
    expect(res.body.refreshToken).toHaveLength(31)
    expect(res.body.refreshTokenExpiresIn).toBeDefined()
    // compare database and api response
    const patient = await Patient.findByPk(res.body.id)
    expect(patient).toBeTruthy()
    expect(patient.accessToken).toBe(res.body.accessToken)
    expect(patient.refreshToken).toBe(res.body.refreshToken)
  })
})

describe(`# POST ${apiBase}/auth/refresh`, () => {
  test('patient should NOT get new tokens without valid refreshtoken', async () => {
    const res = await testApp
      .post(`${apiBase}/auth/refresh`)
      .send({ id: patient1.id, refreshToken: 'invalid_token' })
    expect(res.statusCode).toBe(401)
  })

  test('patient should get new tokens on refresh', async () => {
    const res = await testApp
      .post(`${apiBase}/auth/refresh`)
      .send({ id: patient1.id, refreshToken: patient1.refreshToken })
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(patient1.id)
    expect(res.body.accessToken).toContain('.')
    expect(res.body.accessToken).toHaveLength(31)
    expect(res.body.accessTokenExpiresIn).toBeDefined()
    expect(res.body.refreshToken).toContain('.')
    expect(res.body.refreshToken).toHaveLength(31)
    expect(res.body.refreshTokenExpiresIn).toBeDefined()
    // save new tokens for later attempts
    patient1.accessToken = res.body.accessToken
    patient1.refreshToken = res.body.refreshToken
  })
})

describe(`# POST ${apiBase}/auth/logout`, () => {
  test('after patient logout all tokens should be removed', async () => {
    const res = await testApp
      .get(`${apiBase}/auth/logout`)
      .set('Authorization', 'Bearer ' + patient1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.logoutAt).toBeDefined()
    // check in database
    const patient = await Patient.findByPk(patient1.id)
    expect(patient).toBeTruthy()
    expect(patient.accessToken).toBeNull()
    expect(patient.refreshToken).toBeNull()
  })

  test('after patient logout, the accesstoken is not valid', async () => {
    const res = await testApp
      .get(`${apiBase}/auth/logout`)
      .set('Authorization', 'Bearer ' + patient1.accessToken)
    expect(res.statusCode).toBe(401)
  })
})
