const { DataTypes } = require("sequelize");
const sequelize = require('../db/index.js')

const Wallet = sequelize.define('Wallet', {
  id : {
    type : DataTypes.INTEGER,
    autoIncrement : true,
    allowNull : false,
    primaryKey : true,  
  },
  money : {
    type : DataTypes.STRING,
    require : true,
  }
});

console.log(Wallet === sequelize.models.Wallet); // true

module.exports = { Wallet };