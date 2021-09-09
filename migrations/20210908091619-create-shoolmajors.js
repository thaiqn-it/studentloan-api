'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ShoolMajors', {
      majorId: {
        allowNull: false,
        type : Sequelize.UUID,
        references : {
          model : 'Majors',
          id : 'id',
        }
      },
      schoolId : {
        allowNull: false,
        type : Sequelize.UUID,
        references : {
          model : 'Schools',
          id : 'id',
        }
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
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ShoolMajors');
  }
};