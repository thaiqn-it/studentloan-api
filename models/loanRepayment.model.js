module.exports = (sequelize, DataTypes) => {
    const LoanRepayment = sequelize.define("LoanRepayment", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      loanScheduleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "LoanSchedule",
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
  
    return LoanRepayment;
  };
  