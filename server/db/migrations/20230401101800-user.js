const { Sequelize } = require('sequelize')

const config = require('../../config')

module.exports = {
  up: async ({ context: queryInterface }) => {
    return queryInterface.sequelize.transaction(async t => {
      try {
        await queryInterface.createTable('Users', {
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
          email: {
            type: Sequelize.STRING,
            unique: true
          },
          phone: {
            type: Sequelize.STRING
          },
          password: {
            type: Sequelize.STRING
          },
          role: {
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
          lastLoginAt: {
            type: Sequelize.DATE
          },
          autoLogoutAfter: {
            type: Sequelize.INTEGER
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
            onDelete: 'NO ACTION',
            references: {
              model: 'UserGroups',
              key: 'id'
            }
          }
        }, { transaction: t })
        await queryInterface.addIndex('Users', ['accessToken'], { transaction: t })
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    return queryInterface.sequelize.transaction(async t => {
      try {
        await queryInterface.removeIndex('Users', ['id', 'accessToken'], { transaction: t })
        await queryInterface.dropTable('Users', { transaction: t })
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    })
  }
}
