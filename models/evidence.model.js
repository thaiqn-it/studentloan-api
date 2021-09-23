module.exports = (sequelize, DataTypes) => {
  const Evidence = sequelize.define("Evidence", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // StudentLoanId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: "Loan",
    //     key: "LoanId",
    //   },
    // },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  });

  Evidence.associate = (models) => {
    Evidence.belongsToMany(models.Image, {
      through: "Image_Evidence",
      foreignKey: "id",
      otherKey: "id",
    });
  };

  //   Evidence.associate = (models) => {
  //     Evidence.hasOne(models.Investor, {
  //       foreignKey: "BackCitizenCardImageId",
  //     });
  //   };

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

  return Evidence;
};
