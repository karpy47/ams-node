// These settings are only used by the Sequlize CLI utility

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL_DEV'
  },
  test: {
    use_env_variable: 'DATABASE_URL_TEST'
  },
  production: {
    use_env_variable: 'DATABASE_URL_PROD'
  }
}
