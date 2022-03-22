module.exports = (sequelize, DataTypes) => {
    const SchoolMajor = sequelize.define("SchoolMajor", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      majorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model:"Major",
            key:"id"
        }
      },
      schoolId: {
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model:"School",
            key:"id"
        }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });

    SchoolMajor.associate = (models) => {
        SchoolMajor.belongsTo(models.Major, {
          foreignKey: "majorId",
        });
        SchoolMajor.belongsTo(models.School, {
            foreignKey: "schoolId",
        });
        SchoolMajor.hasOne(models.Student, {
            foreignKey: "schoolMajorId",
        });
      };

    return SchoolMajor;
  };
  