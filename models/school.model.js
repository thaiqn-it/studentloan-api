const { DataTypes } = require("sequelize");
const sequelize = require('../db/index.js')

const School = sequelize.define('School', {
  id : {
      type : DataTypes.INTEGER,
      autoIncrement : true,
      allowNull : false,
      primaryKey : true,  
  },
  name : {
      type : DataTypes.STRING,
      require : true,
      allowNull : false,
  },
  city : {
      type : DataTypes.STRING,
      require : true,
      allowNull : false,
  },
  district : {
      type : DataTypes.STRING,
      require : true,
      allowNull : false,
  }
});

module.exports = { School };