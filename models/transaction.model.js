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
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Account",
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

  return Transaction;
};
