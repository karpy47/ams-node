const { Sequelize } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('AuditLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      table: {
        type: Sequelize.STRING
      },
      tableId: {
        type: Sequelize.INTEGER
      },
      action: {
        type: Sequelize.STRING
      },
      before: {
        type: Sequelize.JSON
      },
      changed: {
        type: Sequelize.JSON
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
    await queryInterface.dropTable('AuditLogs')
  }
}
