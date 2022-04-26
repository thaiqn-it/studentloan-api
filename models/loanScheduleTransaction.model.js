module.exports = (sequelize, DataTypes) => {
    const LoanScheduleTransaction = sequelize.define("LoanScheduleTransaction", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Transaction",
            key: "id",
        },
      },
      loanScheduleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "LoanSchedule",
            key: "id",
        },
      }
    });

    LoanScheduleTransaction.associate = (models) => {
      LoanScheduleTransaction.belongsTo(models.Transaction,{
        foreignKey: "transactionId",
      })
    };
  
    return LoanScheduleTransaction;
  };
  