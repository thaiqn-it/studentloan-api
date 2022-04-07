module.exports = (sequelize, DataTypes) => {
    const Major = sequelize.define("Major", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status:{
        type: DataTypes.STRING,
      }
    });

    Major.associate = (models) => {
        Major.hasMany(models.SchoolMajor, {
          foreignKey: "majorId",
        });
      };

    return Major;
  };
  