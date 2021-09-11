'use strict';
const {
  Model
} = require('sequelize');
const { USER_TYPE,USER_GENDER } = require('./enum/index')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    id : {
      type : DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey : true,
    },
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    gmail: DataTypes.STRING,
    gender : DataTypes.ENUM(Object.values(USER_GENDER)),
    userType : DataTypes.ENUM(Object.values(USER_TYPE)),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status : DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};