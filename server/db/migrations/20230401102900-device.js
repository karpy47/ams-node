const { Sequelize } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('Devices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serialNo: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      modelRefNo: {
        type: Sequelize.STRING
      },
      manufacturedAt: {
        type: Sequelize.DATE
      },
      manufactureWiRefNo: {
        type: Sequelize.STRING
      },
      signatureManufacturing: {
        type: Sequelize.STRING
      },
      signatureInspection: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.TEXT
      },
      firstUseAt: {
        type: Sequelize.DATE
      },
      lastUseAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('Devices')
  }
}
