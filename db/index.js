const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("StudentLoan", "sa", "123456", {
  host: "localhost",
  dialect: "mssql",
  logging: false,
});

module.exports = { 
  mssqlConnection: sequelize
};