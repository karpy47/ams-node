const { Sequelize } = require('sequelize');

const config = require('../../config')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('Clinics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: config.status.active
      },
      name: {
        type: Sequelize.STRING
      },
      address1: {
        type: Sequelize.STRING
      },
      address2: {
        type: Sequelize.STRING
      },
      postcode: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      openHours: {
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
      userGroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'NO ACTION',
        references: {
          model: 'UserGroups',
          key: 'id'
        }
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('Clinics')
  }
}
