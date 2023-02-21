// const { app } = require('../../../app')
const { Patient } = require('..')

describe('Test the Patient model', () => {
  const patientInfo = {
    firstname: 'James',
    lastname: 'Bond',
    email: '007@mi6.gov.uk',
    password: 'IloveQ'
  }

  it('should hash password at save', async () => {
    const user = await Patient.create(patientInfo)
    expect(user.password).not.toBe(patientInfo.password)
    expect(user.password).toContain('$')
    expect(user.password).toHaveLength(60)
  })
})
