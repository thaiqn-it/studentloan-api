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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    job: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      value: "active",
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  });

  //   Investor.associate = (models) => {
  //     Investor.belongsTo(models.User, {
  // foreignKey:"UserId",
  //     });
  //   };

  // Investor.associate = (models) => {
  //     Investor.belongsTo(models.School, {
  //       foreignKey: "SchoolId"
  //     });
  //   };

  Investor.associate = (models) => {
    Investor.hasMany(models.Investment, {
      foreignKey: "investorId",
    });
  };


  return Investor;
};
