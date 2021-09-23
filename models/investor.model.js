module.exports = (sequelize, DataTypes) => {
  const Investor = sequelize.define("Investor", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    //  UserId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: "Users",
    //     key: "UserId",
    //   },
    // },
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
    // OldSchool: {
    //   type: DataTypes.UUID,
    //   allowNull: true,
    //   references: {
    //     model: "Schools",
    //     key: "SchoolId",
    //   },
    // },
    citizenId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    frontCitizenCardImageId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Images",
        key: "id",
      },
    },
    backCitizenCardImageId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Images",
        key: "id",
      },
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
    Investor.belongsTo(models.Image, {
      foreignKey: "backCitizenCardImageId",
    });
    Investor.hasMany(models.Investment, {
      foreignKey: "investorId",
    });
    Investor.belongsTo(models.Image, {
      foreignKey: "frontCitizenCardImageId",
    });
  };


  return Investor;
};
