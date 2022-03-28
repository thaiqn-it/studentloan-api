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
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      birthDate:{
        type: DataTypes.DATE
      },
      studentCardId:{
          type: DataTypes.STRING(50)
      },
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
      },
      status : {
        type: DataTypes.STRING,
        allowNull: false
      },
      address : {
        type: DataTypes.STRING,
      },
    });

    Student.associate = (models) => {
      Student.hasMany(models.Loan, {
        foreignKey: "studentId",
      }),
      Student.belongsTo(models.SchoolMajor, {
        foreignKey: "schoolMajorId",
      })
      Student.hasMany(models.Tutor, {
        foreignKey: "studentId",
      });
      Student.hasMany(models.Archievement, {
        foreignKey: "studentId",
      })
  };

    return Student;
  };
  