module.exports = (sequelize, DataTypes) => {
    const SystemConfig = sequelize.define("SystemConfig", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
        },
        value: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.BOOLEAN,
        },
    });
    return SystemConfig;
};
