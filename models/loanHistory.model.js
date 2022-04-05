module.exports = (sequelize, DataTypes) => {
    const LoanHistory = sequelize.define("LoanHistory", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      loanId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Loan",
            key: "id",
        },
      },
      adminId: {
        type: DataTypes.UUID,
        references: {
            model: "User",
            key: "id",
        },
      },
      type: {
        type: DataTypes.STRING,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      description:{
        type: DataTypes.STRING,
      }
    });
  
    return LoanHistory;
  };
  