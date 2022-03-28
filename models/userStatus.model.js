module.exports = (sequelize, DataTypes) => {
    const UserStatus = sequelize.define("UserStatus", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      adminId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Admin",
          key: "id",
        },
      },
      description: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      isActive : {
        type : DataTypes.BOOLEAN
      },
    });

    UserStatus.associate = (models) => {
        UserStatus.belongsTo(models.User, {
            foreignKey:"userId",
        });
    };

    return UserStatus;
  };
  