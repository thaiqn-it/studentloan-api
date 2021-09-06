const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("StudentLoan", "DBW", "123456", {
  host: "localhost",
  dialect: "mssql",
  logging: false,
});

module.exports = { mssqlConnection: sequelize };
