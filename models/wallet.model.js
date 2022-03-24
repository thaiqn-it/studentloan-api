module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define("Wallet", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "User",
            key: "id",
        },
      },
      money: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Wallet.associate = (models) => {
        Wallet.hasMany(models.Transaction, {
        foreignKey: "walletId",
      });
      Wallet.belongsTo(models.User, {
        foreignKey: "userId",
      });
    };
  
    return Wallet;
  };
  