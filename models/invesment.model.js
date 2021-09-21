module.exports = (sequelize, DataTypes) => {
  const Investment = sequelize.define("Investment", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    investorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Investors",
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
    // LoanAccountId: {
    //   type: DataTypes.UUID,
    //   allowNull: true,
    //   references: {
    //     model: "Investor",
    //     key: "InvestorId",
    //   },
    // },
  });

  Investment.associate = (models) => {
    Investment.belongsTo(models.Investor, {
      foreignKey: "investorId",
    });
  };

  //   Investment.associate = (models) => {
  //     Investment.belongsTo(models.LoanAccount, {
  //       foreignKey: "LoanAccountId",
  //     });
  //   };

  return Investment;
};
