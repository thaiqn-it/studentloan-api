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
        startDate: {
            type: DataTypes.DATE
        },
        endDate: {
            type: DataTypes.DATE
        },
        parentId: {
            type: DataTypes.UUID,
            references: {
                model: "Contract",
                key: "id"
            }
        },
        contractNote: {
            type: DataTypes.STRING,
        }
    });

    return Contract;
};
