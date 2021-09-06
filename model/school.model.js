const { DataTypes } = require("sequelize");
const { mssqlConnection } = require("../db");

const School = mssqlConnection.define("School", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  district: {
    type: DataTypes.STRING,
  },
});

module.exports = { School };
