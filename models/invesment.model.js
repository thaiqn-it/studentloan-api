module.exports = (sequelize, DataTypes) => {
  const Investment = sequelize.define("Investment", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    investorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Investor",
        key: "id",
      },
    },
    interest: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
  };

  //   Investment.associate = (models) => {
  //     Investment.belongsTo(models.LoanAccount, {
  //       foreignKey: "LoanAccountId",
  //     });
  //   };

  return Investment;
};
