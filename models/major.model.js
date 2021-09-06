const { DataTypes } = require("sequelize");
const sequelize = require('../db/index.js')

const Major = sequelize.define('Major', {
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
  }
});

Major.hasMany(Major, {foreignKey : 'parentId'})

module.exports = { Major };