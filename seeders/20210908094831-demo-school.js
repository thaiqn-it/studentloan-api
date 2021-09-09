'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Schools', 
    [
      {
        id: uuidv4(),
        name: 'FPT University',
        city: 'Ho Cho Minh City',
        district: 'District 9',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Van Hien University',
        city: 'Ho Cho Minh City',
        district: 'District 3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Ho Chi Minh City University of Technology',
        city: 'Ho Cho Minh City',
        district: 'District 10',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'University of Information Technology (UIT)',
        city: 'Ho Cho Minh City',
        district: 'Thu Duc',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'University of Economics Ho Chi Minh City',
        city: 'Ho Cho Minh City',
        district: 'District 3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
