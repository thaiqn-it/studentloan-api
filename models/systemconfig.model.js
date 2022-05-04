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
        penaltyFee:{
            type: DataTypes.FLOAT,
        },
        minRaiseMoney:{
            type: DataTypes.INTEGER,
        },
        maxRaiseMoney:{
            type: DataTypes.INTEGER,
        },
        minDuration:{
            type: DataTypes.INTEGER,
        },
        maxDuration:{
            type: DataTypes.INTEGER,
        },
        postExpireTime:{
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.BOOLEAN,
        },
    });
    return SystemConfig;
};
