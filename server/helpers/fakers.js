const { faker } = require('@faker-js/faker')
const config = require('../config')
const { UserGroup, Clinic, User, Patient, Component, Device } = require('../db/models')
const _ = require('lodash')

function rndInt (min = 0, max = 99) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

async function createFakeUserGroup () {
  const userGroup = new UserGroup({
    name: faker.company.name(),
    description: faker.lorem.sentence()
  })
  return await userGroup.save()
}

async function createFakeClinic (group) {
  const clinic = new Clinic({
    name: faker.company.name(),
    address1: faker.address.streetAddress(),
    postcode: faker.address.zipCode(),
    city: faker.address.cityName(),
    phone: faker.phone.number(),
    openHours: 'Open hours: Mon-Fri 9-18',
    userGroupId: group.id
  })
  return await clinic.save()
}

async function createFakePatient (clinic) {
  const patient = new Patient({
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    address1: faker.address.streetAddress(),
    postcode: faker.address.zipCode(),
    city: faker.address.cityName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    clinicId: clinic !== null ? clinic.id : null
  })
  return await patient.save()
}

async function createFakeUser (userGroup, role) {
  const user = new User({
    name: faker.name.firstName() + ' ' + faker.name.lastName(),
    login: faker.internet.userName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    password: 'secret',
    role,
    userGroupId: userGroup.id
  })
  return await user.save()
}

async function createFakeComponent (dmCode, type, device) {
  const component = new Component({
    dmCode,
    status: config.status.active,
    type,
    partRefNo: '200xxxx',
    manufacturedAt: faker.date.recent(),
    signatureManufacturing: 'DEV',
    signatureInspection: 'DEV',
    comment: faker.lorem.sentence(),
    deviceId: device.id
  })
  return await component.save()
}

async function createFakeDevice (serialNo) {
  const device = new Device({
    serialNo: String(serialNo),
    modelRefNo: '200xxxx',
    manufacturedAt: faker.date.recent(),
    manufactureWiRefNo: '200xxxx',
    signatureManufacturing: 'DEV',
    signatureInspection: 'DEV',
    comment: faker.lorem.sentence()
  })
  return await device.save()
}

async function populatedUserGroup (usersCount = 100, clinicsCount = 10, patientsCount = 100) {
  const group = await createFakeUserGroup()

  await createFakeUser(group, config.roles.admin)
  for (let i = 1; i < usersCount; i++) {
    await createFakeUser(group, Math.random() < 0.1 ? config.roles.admin : config.roles.user)
  }

  for (let i = 0; i < clinicsCount; i++) {
    const clinic = await createFakeClinic(group)
    for (let j = 0; j < clinicsCount; j++) {
      await createFakePatient(clinic)
    }
  }

  return group
}

async function populatedDevice (serialNo, componentsNo, components = 6) {
  const device = await createFakeDevice(serialNo)
  const rndTypes = _.sampleSize(config.componentTypes, components)
  for (const type of rndTypes) {
    const dmCode = String(type.charAt(0) + componentsNo)
    await createFakeComponent(dmCode, type, device)
    componentsNo = componentsNo + 1
  }
  return device
}

module.exports = { rndInt, populatedUserGroup, populatedDevice }
