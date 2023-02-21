const app = require('../../../app')
const testApp = require('supertest')(app)
const { Patient, Device } = require('../../../db/models')
const { createPatient } = require('../../../tests/helpers/seeder')
const apiBase = '/app/v1'

let patient1
const data = {
  firstname: 'James',
  lastname: 'Bond',
  city: 'London',
  comment: 'My name is Bond, James Bond.'
}

beforeAll(async () => {
  patient1 = await createPatient()
})

describe(`# PUT ${apiBase}/profile`, () => {
  test('profile update without valid accesstoken should fail', async () => {
    const res1 = await testApp
      .put(`${apiBase}/profile`)
      .send(data)
      .set('Authorization', 'Bearer ' + 'not-a-valid-accesstoken')
    expect(res1.statusCode).toBe(401)
  })

  test('profile update should report back updated values', async () => {
    const res = await testApp
      .put(`${apiBase}/profile`)
      .send(data)
      .set('Authorization', 'Bearer ' + patient1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.firstname).toBe(data.firstname)
    expect(res.body.lastname).toBe(data.lastname)
    expect(res.body.city).toBe(data.city)
    expect(res.body.comment).toBe(data.comment)
    expect(res.body.password).toBeUndefined()
    expect(res.body.accessToken).toBeUndefined()
    expect(res.body.refreshToken).toBeUndefined()
    // check in db
    const patient = await Patient.findByPk(res.body.id)
    expect(patient).toBeTruthy()
    expect(patient.firstname).toBe(data.firstname)
    expect(patient.lastname).toBe(data.lastname)
    expect(patient.city).toBe(data.city)
    expect(patient.comment).toBe(data.comment)
  })

  test('password update should result in hashed db value', async () => {
    const res = await testApp
      .put(`${apiBase}/profile`)
      .send({ password: 'someotherpwd', firstname: 'Q was here' })
      .set('Authorization', 'Bearer ' + patient1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.password).toBeUndefined()
    // check in db
    const patient = await Patient.findByPk(res.body.id)
    expect(patient).toBeTruthy()
    expect(patient.password).not.toBe('someotherpwd')
    expect(patient.password).toContain('$')
    expect(patient.password).toHaveLength(60)
  })
})

describe(`# POST ${apiBase}/profile/device`, () => {
  test('patient should not have a device linked', async () => {
    const res = await testApp
      .get(`${apiBase}/profile/device`)
      .set('Authorization', 'Bearer ' + patient1.accessToken)
    expect(res.statusCode).toBe(404)
  })

  test('a new device should be created and linked to a patient', async () => {
    const res = await testApp
      .post(`${apiBase}/profile/device`)
      .send({ serialNo: 'SE123' })
      .set('Authorization', 'Bearer ' + patient1.accessToken)
    expect(res.statusCode).toBe(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.serialNo).toBeDefined()
    // check in db
    const device = await Device.findByPk(res.body.id)
    expect(device).toBeTruthy()
    const patient = await Patient.findByPk(patient1.id)
    expect(patient.deviceId).toBe(device.id)
  })
})

describe(`# GET ${apiBase}/profile/device`, () => {
  test('patient should report linked device', async () => {
    const res = await testApp
      .get(`${apiBase}/profile/device`)
      .set('Authorization', 'Bearer ' + patient1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBeDefined()
    expect(res.body.serialNo).toBeDefined()
  })
})

describe(`# GET ${apiBase}/profile`, () => {
  test('profile read without valid accesstoken should fail', async () => {
    const res1 = await testApp
      .get(`${apiBase}/profile`)
      .set('Authorization', 'Bearer ' + 'not-a-valid-accesstoken')
    expect(res1.statusCode).toBe(401)
  })

  test('profile read should report not report tokens or password', async () => {
    const res = await testApp
      .get(`${apiBase}/profile`)
      .set('Authorization', 'Bearer ' + patient1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.password).toBeUndefined()
    expect(res.body.accessToken).toBeUndefined()
    expect(res.body.refreshToken).toBeUndefined()
    expect(res.body.resetPasswordToken).toBeUndefined()
    expect(res.body.deletedAt).toBeUndefined()
  })

  test('a linked device and a linked clinic should be reported in profile', async () => {
    const res = await testApp
      .get(`${apiBase}/profile`)
      .set('Authorization', 'Bearer ' + patient1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.Device).toBeDefined()
    expect(res.body.Device.id).toBeDefined()
    expect(res.body.Device.serialNo).toBeDefined()
  })
})

describe(`# DELETE ${apiBase}/profile`, () => {
  test('a deleted profile should be soft-deleted', async () => {
    const res = await testApp
      .delete(`${apiBase}/profile`)
      .set('Authorization', 'Bearer ' + patient1.accessToken)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(patient1.id)
    // check in db
    const patient = await Patient.findByPk(res.body.id, { paranoid: false })
    expect(patient).toBeTruthy()
    expect(patient.deletedAt).not.toBeNull()
  })
})
