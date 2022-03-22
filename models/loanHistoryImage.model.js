module.exports = (sequelize, DataTypes) => {
    const LoanHistoryImage = sequelize.define("LoanHistoryImage", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      loanHistoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "LoanHistory",
            key: "id",
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
  
    return LoanHistoryImage;
  };
  