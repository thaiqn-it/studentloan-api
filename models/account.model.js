module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define("Account", {
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Account.associate = (models) => {
    Account.hasOne(models.Transaction, {
      foreignKey: "accountId",
    });
  };

  return Account;
};
