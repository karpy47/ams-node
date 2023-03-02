require('dotenv').config()

const config = {
  app: {
    name: 'AMS-backend',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '3000'
  },
  baseClientUrl: {
    development: 'http://localhost:3000',
    test: 'http://localhost:3000',
    production: 'https://system.abilion.com'
  },
  db: {
    development: {
      url: process.env.DATABASE_URL_DEV,
      // options: { logging: (...msg) => console.log(msg) }
      // options: { logging: console.log }
      options: { logging: false }
    },
    test: {
      url: process.env.DATABASE_URL_TEST,
      options: { logging: false }
    },
    production: {
      url: process.env.DATABASE_URL_PROD,
      options: { logging: false }
    }
  },
  roles: {
    user: 'user',
    admin: 'admin',
    superUser: 'superUser',
    superAdmin: 'superAdmin',
    factory: 'factory'
  },
  status: {
    active: 'active',
    locked: 'locked',
    deleted: 'deleted'
  },
  auditActions: {
    create: 'create',
    update: 'update',
    delete: 'delete'
  },
  auditSources: {
    server: 'server',
    cli: 'cli',
    user: 'user',
    patient: 'patient',
    unknown: 'unknown'
  },
  eventTypes: {
    login: 'login',
    loginFail: 'loginFail',
    logout: 'logout',
    accessTokenFail: 'accessTokenFail',
    refresh: 'refresh',
    refreshTokenFail: 'refreshTokenFail',
    resetPwdRequest: 'resetPwdRequest',
    resetPwdRequestFail: 'resetPwdRequestFail',
    resetPwd: 'resetPwd',
    resetPwdFail: 'resetPwdFail',
    pwdChange: 'pwdChange',
    grantError: 'grantError'
  },
  eventSources: {
    user: 'user',
    patient: 'patient',
    server: 'server',
    unknown: 'unknown'
  },
  userAccess: {
    accessTokenTTLsec: 3600 * 100, // 100 hours
    refreshTokenTTLsec: 3600 * 1200, // 1200 hours
    resetPasswordTokenTTLsec: 60 * 10 // 10 minutes
  },
  patientAccess: {
    accessTokenTTLsec: 3600, // 1 hour
    refreshTokenTTLsec: 3600 * 24, // 1 day
    resetPasswordTokenTTLsec: 60 * 10 // 10 minutes
  },
  componentTypes: {
    pca: 'A-PCA Assembly',
    battery: 'B-Main Battery',
    coil: 'C-Coil Assembly',
    pumpMotor: 'D-Pump Motor Assembly',
    enclosure: 'E-Enclosure',
    solenoid: 'F-Solenoid Assembly'
  },
  logic: {
    createDeviceIfNotFound: true
  }
}

config.isDevEnv = (config.app.env === 'development')
config.isTestEnv = (config.app.env === 'test')
config.isProdEnv = (config.app.env === 'production')

config.baseClientUrl = config.baseClientUrl[config.app.env]

module.exports = config
