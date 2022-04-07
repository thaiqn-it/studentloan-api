module.exports = (sequelize, DataTypes) => {
  const Investment = sequelize.define("Investment", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transactionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
          model: "Transaction",
          key: "id",
      },
    },
    investorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Investor",
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    percent : {
      type : DataTypes.FLOAT,
      allowNull : false
    },
    loanId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Loan",
        key: "id",
      },
    },
  });

  Investment.associate = (models) => {
    Investment.belongsTo(models.Investor, {
      foreignKey: "investorId",
    });
    Investment.belongsTo(models.Loan, {
      foreignKey: "loanId",
    });
    Investment.belongsTo(models.Transaction, {
      foreignKey: "transactionId",
    });
    Investment.hasOne(models.Contract,{
      foreignKey : "investmentId"
    })
  };
  
  return Investment;
};
