const { Sequelize } = require('sequelize');

const config = require('../../config')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('Patients', {
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
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
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
      personalId: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      birthDate: {
        type: Sequelize.DATE
      },
      password: {
        type: Sequelize.STRING
      },
      accessToken: {
        type: Sequelize.STRING
      },
      refreshToken: {
        type: Sequelize.STRING
      },
      resetPasswordToken: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.TEXT
      },
      lastLoginAt: {
        type: Sequelize.DATE
      },
      deceaseDate: {
        type: Sequelize.DATE
      },
      anonymisedAt: {
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
      },
      deviceId: {
        type: Sequelize.INTEGER,
        onDelete: 'NO ACTION',
        references: {
          model: 'Devices',
          key: 'id'
        }
      },
      clinicId: {
        type: Sequelize.INTEGER,
        onDelete: 'NO ACTION',
        references: {
          model: 'Clinics',
          key: 'id'
        }
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('Patients')
  }
}
