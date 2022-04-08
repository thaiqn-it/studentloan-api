const { LOAN_STATUS } = require('./enum/index')

module.exports = (sequelize, DataTypes) => {
    const Loan = sequelize.define("Loan", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Student",
          key: "id",
        },
      }, 
      totalMoney: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      fixedMoney: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      interest: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      expectedGraduationTime : {
        type : DataTypes.INTEGER,
        allowNull : false,
      },
      title : {
        type : DataTypes.TEXT,
        allowNull : true
      },
      description : {
          type : DataTypes.TEXT,
          allowNull : true,  
      },
      duration : {
          type : DataTypes.INTEGER,
          allowNull : false,
      },
      loanStartAt : {
          type : DataTypes.DATE,
          allowNull : true,
      },
      loanEndAt : {
          type : DataTypes.DATE,
          allowNull : true,
      },
      postCreatedAt : {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW,
        allowNull : false,
      },
      postExpireAt : {
        type : DataTypes.DATE,
        allowNull : false,
      },
      expectedMoney:{
        type:DataTypes.BIGINT,
      },
      penaltyFee : {
        type: DataTypes.FLOAT,
        allowNull: true,
      }
    }, { timestamps : false});
  
    Loan.associate = (models) => {
        Loan.hasMany(models.LoanSchedule, {
          foreignKey: "loanId",
        })
        Loan.hasMany(models.LoanHistory, {
          foreignKey: "loanId",
        })
        Loan.belongsTo(models.Student, {
          foreignKey: "studentId",
        });
        Loan.hasMany(models.Investment,{
          foreignKey : "loanId"
        })
        models.Investment.belongsTo(models.Loan,{
          foreignKey : "loanId"
        })
        Loan.hasMany(models.LoanMedia,{
          foreignKey : "loanId"
        })
        Loan.hasMany(models.LoanHistory, {
          foreignKey: "loanId",
        })
    };
    
    return Loan;
  };