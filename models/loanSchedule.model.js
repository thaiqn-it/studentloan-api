const { LOAN_SCHEDULE_STATUS, LOAN_SCHEDULE_TYPE } = require('./enum/index')

module.exports = (sequelize, DataTypes) => {
    const LoanSchedule = sequelize.define("LoanSchedule", {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      money : {
        type : DataTypes.BIGINT,
        allowNull : false,
      },
      startAt : {
        type : DataTypes.DATE,
        allowNull : false,
      },
      endAt : {
        type : DataTypes.DATE,
        allowNull : false,
      },
      type : {
        type : DataTypes.STRING,
        allowNull : false
      },
      status : {
        type : DataTypes.STRING,
        allowNull : false
      },
      loanId:{
        type: DataTypes.UUID,
        allowNull:false
      },
      TransactionId:{
        type:DataTypes.UUID,
      }

      //penanty money
    });

    LoanSchedule.associate = (models) => {
      LoanSchedule.belongsTo(models.Loan,{
        foreignKey: "loanId",
      })
    };
   
    return LoanSchedule;
};