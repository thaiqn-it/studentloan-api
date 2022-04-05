module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define("Contract", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        loanId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "Loan",
                key: "id",
            },
        },
        status: {
            type: DataTypes.STRING,
        },
        contractUrl : {
            type: DataTypes.STRING,
            allowNull : false
        }
    });

    Contract.associate = (models) => {
        Contract.belongsTo(models.Loan, {
          foreignKey: "loanId",
        });
      };

    return Contract;
};
