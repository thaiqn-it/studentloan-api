const { Sequelize } = require("sequelize");
const {
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_ADDRESS,
  DATABASE_TYPE,
} = require("../constants");

const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  {
    host: DATABASE_ADDRESS,
    dialect: DATABASE_TYPE,
    logging: false,
    define: {
      freezeTableName: true,
    },
  }
);

module.exports = sequelize;
