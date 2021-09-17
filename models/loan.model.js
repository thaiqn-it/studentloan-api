const { LOAN_STATUS } = require('./enum/index')

module.exports = (sequelize, DataTypes) => {
    const Loan = sequelize.define("Loan", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      totalMoney: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      interest: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      expectedGraduationDay : {
          type : DataTypes.DATE,
          allowNull : false,
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
      status : {
        type : DataTypes.STRING,
        allowNull : false
      }
    }, { timestamps : false});
  
    Loan.associate = (models) => {
        Loan.hasMany(models.LoanSchedule, {
            foreignKey: "loanId",
        })
    };
    
    return Loan;
  };