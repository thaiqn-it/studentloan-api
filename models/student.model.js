module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        // allowNull: false,
        // references:{
        //     model:"Users",
        //     key:"UserId"
        // }
      },
      firstName:{
        type: DataTypes.STRING(70)
      },
      lastName:{
        type: DataTypes.STRING(70)
      },
      schoolId: {
        type: DataTypes.UUID,
        // allowNull: false,
        // references:{
        //     model:"Schools",
        //     key:"id"
        // }
      },
      major:{
          type: DataTypes.STRING(70)
      },
      totalSemester:{
          type: DataTypes.INTEGER
      },
      currentSemester:{
        type: DataTypes.INTEGER
      },
      birthDate:{
        type: DataTypes.DATE
      },
      studentCardId:{
          type: DataTypes.STRING(50)
      },

      //
      frontCitizenCardImageId:{
        type: DataTypes.UUID,
      },
      backCitizenCardImageId:{
        type: DataTypes.UUID,
      },
      frontStudentCardImageId:{
        type: DataTypes.UUID,
      },
      backStudentCardImageId:{
        type: DataTypes.UUID,
      },
      //

      citizenId:{
          type: DataTypes.STRING(20)
      },
      citizenCardCreatedDate:{
          type: DataTypes.DATE
      },
      citizenCardCreatedPlace:{
          type: DataTypes.DATE
      },
      parentId:{
        type: DataTypes.UUID,
        // allowNull: false
      }
    });

    // Student.associate = (models) => {
    //     Student.hasOne(models.School, {
    //       foreignKey: "studentId",
    //     });
    //   };

    return Student;
  };
  