module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("Admin", {
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
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Admin.associate = (models) => {
        Admin.belongsTo(models.User, {
        foreignKey: "userId",
      });
    };
  
    return Admin;
  };
  