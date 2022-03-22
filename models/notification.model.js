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
      type: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
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
  