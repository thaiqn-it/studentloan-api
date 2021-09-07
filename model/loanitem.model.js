const { DataTypes } = require("sequelize");
const { mssqlConnection } = require("../db");

const LoanItem = mssqlConnection.define("LoanItem", {
  loanItemId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  remainMoney: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paidDay: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

LoanItem.hasMany(LoanItem, {foreignKey:'loanPayId'})

module.exports = { LoanItem };