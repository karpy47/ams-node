const { Sequelize } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('EventLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      sourceType: {
        type: Sequelize.STRING
      },
      sourceId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('EventLogs')
  }
}
