module.exports = (sequelize, DataTypes) => {
    const Tutor = sequelize.define("Tutor", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name:{
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        birthday:{
            type: DataTypes.DATE,
        },
        address:{
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
        frontCitizenCardImageUrl:{
            type: DataTypes.STRING,
        },
        backCitizenCardImageUrl:{
            type: DataTypes.STRING,
        },   
        portraitUrl : {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING,
        },
        relation:{
            type: DataTypes.STRING,
        }
    });
  
    Tutor.associate = (models) => {
        Tutor.hasOne(models.Student, {
            foreignKey: "tutorId",
        });
    };
  
    return Tutor;
  };
  