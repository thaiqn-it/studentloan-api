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
    methodId: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    from: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    to: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Transaction;
};
