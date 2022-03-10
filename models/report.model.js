module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define("Report", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    loanId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    investorId:{
      type: DataTypes.UUID,
    }
  });

  Report.associate = (models) => {
    Report.belongsTo(models.Investor, {
      foreignKey: "investorId",
    });

    Report.belongsTo(models.Loan,{
      foreignKey: "loanId",
    })
  };

  return Report;
};
