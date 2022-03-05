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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    targetId : {
      type: DataTypes.TEXT, 
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Transaction;
};
