module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
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
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isRead:{
        type: DataTypes.BOOLEAN,
      },
      redirectUrl:{
        type: DataTypes.STRING,
      },
      description:{
        type: DataTypes.STRING,
      }
    });
  
    return Notification;
  };
  