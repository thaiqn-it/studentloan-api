module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      value: "active",
    },
  });

  Image.associate = (models) => {
    Image.hasOne(models.Investor, {
      foreignKey: "frontCitizenCardImageId",
    });

    Image.hasOne(models.Investor, {
      foreignKey: "backCitizenCardImageId",
    });

    Image.belongsToMany(models.Evidence, {
      through: "Image_Evidence",
      foreignKey: "imageId",
      otherKey: "evidenceId",
    });

    Image.hasOne(models.Report, {
        foreignKey: "imageId",
    });

    // Image.hasOne(models.Student, {
    //     foreignKey: "frontCitizenCardImageId",
    // });

    // Image.hasOne(models.Student, {
    //         foreignKey: "backCitizenCardImageId",
    // });

    // Image.hasOne(models.Student, {
    //       foreignKey: "frontStudentCardImageId",
    // }); 

    // Image.hasOne(models.Student, {
    //   foreignKey: "backStudentCardImageId",
    // });
  };
  
  return Image;
};
