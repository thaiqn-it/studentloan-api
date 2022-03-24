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
    type: {
      type: DataTypes.STRING,
      allowNull: false,  
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    walletId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Wallet",
        key: "id",
      },
    },
    recipientId : {
      type: DataTypes.UUID,
      allowNull: true,
    },
    recipientName : {
      type: DataTypes.TEXT, 
      allowNull: false,
    },
    senderId : {
      type: DataTypes.UUID,
      allowNull: true,
    },
    senderName : {
      type: DataTypes.TEXT, 
      allowNull: false,
    },
    paypalTransaction : {
      type: DataTypes.TEXT, 
      allowNull: true,
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

  
  Transaction.associate = (models) => {
    Transaction.hasOne(models.Investment, {
      foreignKey: "transactionId",
    });
  };

  return Transaction;
};
