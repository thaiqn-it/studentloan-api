'use strict';
const { USER_TYPE,USER_GENDER } = require('./enum/index')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      phone: {
        allowNull : false,
        type: Sequelize.STRING
      },
      password: {
        allowNull : false,
        type: Sequelize.STRING
      },
      gmail: {
        allowNull : false,
        type: Sequelize.STRING
      },
      gender : {
        allowNull : false,
        type : Sequelize.ENUM(Object.values(USER_GENDER))
      },
      userType : {
        allowNull : false,
        type : Sequelize.ENUM(Object.values(USER_TYPE))
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      status : {
        type : Sequelize.BOOLEAN
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};