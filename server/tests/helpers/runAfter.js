const { sequelize } = require('../../db/models')

// After every test file is done, close the DB connection
// (oterwise about 10 sec delay to autoclose for every connection)
afterAll(() => sequelize.close())
