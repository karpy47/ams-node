const { Sequelize } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('DeviceEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deviceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: 'NO ACTION',
        references: {
          model: 'Devices',
          key: 'id'
        }
      },
      componentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: 'NO ACTION',
        references: {
          model: 'Components',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.STRING
      },
      eventType: {
        type: Sequelize.STRING
      },
      eventAt: {
        type: Sequelize.DATE
      },
      signature: {
        type: Sequelize.STRING
      },
      description: {
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
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('DeviceEvents')
  }
}
