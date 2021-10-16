module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      firstName:{
        type: DataTypes.STRING(70)
      },
      lastName:{
        type: DataTypes.STRING(70)
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
      profileUrl : {
          type: DataTypes.STRING
      },
      //
      frontCitizenCardImageUrl:{
        type: DataTypes.STRING,
      },
      backCitizenCardImageUrl:{
        type: DataTypes.STRING,
      },
      frontStudentCardImageUrl:{
        type: DataTypes.STRING,
      },
      backStudentCardImageUrl:{
        type: DataTypes.STRING,
      },
      //

      citizenId:{
          type: DataTypes.STRING(20)
      },
      citizenCardCreatedDate:{
          type: DataTypes.DATE
      },
      citizenCardCreatedPlace:{
          type: DataTypes.TEXT
      },
      parentId:{
        type: DataTypes.UUID,
        references : {
          model: "Student",
          key: "id"
        }
      }
    });

    return Student;
  };
  