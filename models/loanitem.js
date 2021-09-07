'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoanItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  LoanItem.init({
    remainMoney: DataTypes.FLOAT,
    paidDay: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LoanItem',
  });
  return LoanItem;
};