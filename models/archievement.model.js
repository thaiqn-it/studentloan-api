module.exports = (sequelize, DataTypes) => {
    const Archievement = sequelize.define("Archievement", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Student",
            key: "id",
        },
      },
      description: {
        type: DataTypes.STRING,
      },
      imageUrl : {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
    });
  
    Archievement.associate = (models) => {
        Archievement.belongsTo(models.Student, {
          foreignKey: "studentId",
        });      
    };

    return Archievement;
  };
  