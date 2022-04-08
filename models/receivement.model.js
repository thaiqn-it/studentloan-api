module.exports = (sequelize, DataTypes) => {
    const Receivement = sequelize.define("Receivement", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      investmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Investment",
            key: "id",
        },
      },
      transactionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Transaction",
            key: "id",
        },
      },
      money: {
        type: DataTypes.BIGINT,
      },
      penaltyMoney: {
        type: DataTypes.BIGINT,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
  
    return Receivement;
  };
  