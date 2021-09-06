const { DataTypes } = require("sequelize");
const sequelize = require('../db/index.js')
const { Major } = require('./major.model')
const { School } = require('./school.model')

const SchoolMajor = sequelize.define('SchoolMajor', {
  status : {
    type : DataTypes.BOOLEAN,
    require : true,
    allowNull : false,
  }
});

SchoolMajor.removeAttribute('id')

School.hasMany(SchoolMajor, {foreignKey: { allowNull: false }})
Major.hasMany(SchoolMajor, {foreignKey: { allowNull: false }})

module.exports = { SchoolMajor };