module.exports = (sequelize, DataTypes) => {
    const SchoolMajor = sequelize.define("SchoolMajor", {
      majorId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references:{
            model:"Majors",
            key:"id"
        }
      },
      schoolId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references:{
            model:"Schools",
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
      };

    return SchoolMajor;
  };
  