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
        allowNull: true,
        references: {
            model: "User",
            key: "id",
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull : false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      description:{
        type: DataTypes.STRING,
        allowNull : true
      }
    });

    LoanHistory.associate = (models) => {
      LoanHistory.hasMany(models.LoanHistoryImage,{
        foreignKey: "loanHistoryId",
      })
      LoanHistory.belongsTo(models.Loan,{
        foreignKey: "loanId",
      })
      LoanHistory.belongsTo(models.User,{
        foreignKey: "adminId",
      })
    };
  
    return LoanHistory;
  };
  