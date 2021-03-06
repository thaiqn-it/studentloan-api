module.exports = (sequelize, DataTypes) => {
  const Investor = sequelize.define("Investor", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
     userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "User",
        key: "id",
      },
    },
    citizenId:{
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    citizenCardCreatedDate:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    citizenCardCreatedPlace:{
        type: DataTypes.TEXT,
        allowNull: true,
    },
    frontCitizenCardImageUrl:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    backCitizenCardImageUrl:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references : {
        model: "Investor",
        key: "id"
      }
    }
  });

  Investor.associate = (models) => {
    Investor.hasMany(models.Investment, {
      foreignKey: "investorId",
    });
    Investor.belongsTo(models.User, {
      foreignKey:"userId",
    });
    Investor.hasOne(models.Investor, {
      foreignKey: 'parentId',
      as: 'Information'
    });
  };


  return Investor;
};
