module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    oAuthId: {
      type: DataTypes.STRING,
    },  
  });
  
  User.associate = (models) => {
    User.hasOne(models.Student, {
      foreignKey: "userId",
    });
    User.hasOne(models.Investor, {
      foreignKey: "userId",
    });
    User.hasOne(models.Account, {
      foreignKey: "userId",
    });
    models.Student.belongsTo(User,{
      foreignKey: "userId",
    })
  };
  return User;
};
