module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define("Contract", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        investmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "Investment",
                key: "id",
            },
        },
        status: {
            type: DataTypes.STRING,
        },
        contractUrl : {
            type: DataTypes.STRING,
            allowNull : true
        },
        contractCode : {
            type: DataTypes.STRING(8),
            allowNull : true
        }
    });

    Contract.associate = (models) => {
        Contract.belongsTo(models.Investment, {
          foreignKey: "investmentId",
        });
      };

    return Contract;
};
