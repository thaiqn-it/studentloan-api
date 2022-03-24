module.exports = (sequelize, DataTypes) => {
    const SystemConfig = sequelize.define("SystemConfig", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        interest: {
            type: DataTypes.FLOAT,
        },
        fixedMoney: {
            type: DataTypes.INTEGER,
        },
        transactionFee: {
            type: DataTypes.FLOAT,
        },
        status: {
            type: DataTypes.BOOLEAN,
        },
    });
    return SystemConfig;
};
