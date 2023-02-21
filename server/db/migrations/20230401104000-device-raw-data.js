const { Sequelize } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('DeviceRawData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'NO ACTION',
        references: {
          model: 'Devices',
          key: 'id'
        }
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: 'NO ACTION',
        references: {
          model: 'Patients',
          key: 'id'
        }
      },
      rawData: {
        type: Sequelize.STRING
      },
      downloadSource: {
        type: Sequelize.STRING
      },
      downloadedAt: {
        type: Sequelize.DATE
      },
      dataStartAt: {
        type: Sequelize.DATE
      },
      dataEndAt: {
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
    await queryInterface.dropTable('DeviceRawData')
  }
}
