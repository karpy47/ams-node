const { Sequelize } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('Components', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dmCode: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      partRefNo: {
        type: Sequelize.STRING
      },
      manufacturedAt: {
        type: Sequelize.DATE
      },
      discardedAt: {
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
      poNumber: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.STRING
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
      },
      deviceId: {
        type: Sequelize.INTEGER,
        onDelete: 'NO ACTION',
        references: {
          model: 'Devices',
          key: 'id'
        }
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('Components')
  }
}
