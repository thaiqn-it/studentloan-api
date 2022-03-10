module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.UUID,
      },
      receiverId: {
        type: DataTypes.UUID,
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
  