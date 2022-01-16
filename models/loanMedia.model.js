module.exports = (sequelize, DataTypes) => {
    const LoanMedia = sequelize.define("LoanMedia", {
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
      description: {
        type: DataTypes.STRING,
      },
      imageUrl : {
        type: DataTypes.STRING,
      },
      type : {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
    });
  
    LoanMedia.associate = (models) => {
        LoanMedia.belongsTo(models.Loan, {
          foreignKey: "loanId",
        });      
    };

    return LoanMedia;
  };
  