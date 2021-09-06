const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('StudentLoan', 'sa', '123', {
    host: 'localhost',
    dialect: 'mssql',
});

module.exports = sequelize ;