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
  };

  Image.associate = (models) => {
    Image.hasOne(models.Investor, {
      foreignKey: "backCitizenCardImageId",
    });
  };

  Image.associate = (models) => {
    Image.belongsToMany(models.Evidence, {
      through: "Image_Evidence",
      foreignKey: "ImageId",
      otherKey: "EvidenceId",
    });
  };

  //   Image.associate = (models) => {
  //     Image.hasOne(models.Report, {
  //       foreignKey: "ImageId",
  //     });
  //   };

  //   Image.associate = (models) => {
  //     Image.hasOne(models.Student, {
  //       foreignKey: "FrontCitizenCardImageId",
  //     });
  //   };

  //   Image.associate = (models) => {
  //     Image.hasOne(models.Student, {
  //       foreignKey: "BackCitizenCardImageId",
  //     });
  //   };
  //   Image.associate = (models) => {
  //     Image.hasOne(models.Student, {
  //       foreignKey: "FrontStudentCardImageId",
  //     });
  //   };

  //   Image.associate = (models) => {
  //     Image.hasOne(models.Student, {
  //       foreignKey: "BackStudentCardImageId",
  //     });
  //   };

  return Image;
};
