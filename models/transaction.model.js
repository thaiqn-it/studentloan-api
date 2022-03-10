module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    money: {
      type: DataTypes.BIGINT,
      allowNull: false, 
    },
    date:{
      type: DataTypes.DATE,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,  
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Account",
        key: "id",
      },
    },
    targetId : {
      type: DataTypes.TEXT, 
      allowNull: false,
    },
    transactionFee : {
      type: DataTypes.BIGINT, 
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Transaction;
};
