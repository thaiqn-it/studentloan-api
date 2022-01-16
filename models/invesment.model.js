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
      allowNull: true,
      references: {
        model: "Investor",
        key: "id",
      },
    },
    isDonate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    interest: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    loanId: {
      type: DataTypes.UUID,
      allowNull: false,
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
