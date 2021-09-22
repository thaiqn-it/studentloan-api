module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define("School", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
    },
    district: {
      type: DataTypes.STRING(100),
    },
    status: {
      type: DataTypes.STRING,
    },
  });

  School.associate = (models) => {
    School.hasMany(models.SchoolMajor, {
      foreignKey: "schoolId",
    });
  };

  return School;
};
