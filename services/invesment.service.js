const { Investment,Contract, Sequelize } = require("../models");
const db = require("../models/index");
const { INVESTMENT_STATUS, LOAN_STATUS } = require('../models/enum')
const Op = Sequelize.Op;
const InvestmentService = {};

InvestmentService.getAllByInvestorId = async (id) => {
  return await Investment.findAll({
    where : {
      investorId : id,
      [Op.not] : {
        status : [INVESTMENT_STATUS.CANCEL,INVESTMENT_STATUS.FAIL]
      } 
    },
    attributes: ["id","total"],
    include : [
      {
        model : db.Loan,
        attributes: {
          include: [
            [db.sequelize.literal('(SELECT ISNULL(SUM(money),0) FROM LoanSchedule WHERE LoanSchedule.loanId = Loan.id AND LoanSchedule.status ='+ "'COMPLETED'" +')'), 'PaidMoney']
          ]
        },
        include : [
          {
            model : db.Student,
            attributes: ["id"],
            include : [
              {
                model : db.SchoolMajor,
                attributes: ["id"],
                include : [
                  { model : db.Major, attributes: ["name"] },
                  { model : db.School, attributes: ["name"], },
                ]
              },
              {
                model : db.User,
                attributes: ["firstname","lastname","profileUrl"],
              }
            ]
          }
        ],
      }
    ],
  });
};

InvestmentService.createOne = async (InvestmentInfo) => {
  return await Investment.create(InvestmentInfo);
};

InvestmentService.sumTotalInvestmentByInvetorId = async (investorId) => {
  return Investment.sum('total',{ where: { investorId, status : INVESTMENT_STATUS.INVESTED } })
};

InvestmentService.countTotalByInvestorId = async (investorId) => {
  return Investment.count({ where: { investorId } })
};

InvestmentService.countPendingByInvestorId = async (investorId) => {
  return Investment.count({ 
    where: { 
      investorId,
      status : INVESTMENT_STATUS.PENDING
    } 
  })
};

InvestmentService.countLoanFinishByInvestorId = async (investorId) => {
  return Investment.count({ 
    where: { 
      investorId,
      status : INVESTMENT_STATUS.INVESTED
    },
    include : {
      model : db.Loan,
      required : true,
      include : {
        model : db.LoanHistory,
        where : {
          type : LOAN_STATUS.FINISH,
          isActive : true
        },
        required : true
      }
    }
  })
};

InvestmentService.countLoanOngoingByInvestorId = async (investorId) => {
  return Investment.count({ 
    where: { 
      investorId,
      status : INVESTMENT_STATUS.INVESTED
    },
    include : {
      model : db.Loan,
      required : true,
      include : {
        model : db.LoanHistory,
        where : {
          type : LOAN_STATUS.ONGOING,
          isActive : true
        },
        required : true
      }
    }
  })
};

InvestmentService.findAllByLoanId = async (id) =>{
  return Investment.findAll({
    attributes:['id'],
    where:{
      loanId:id
    },
    include:[
      {
        model: Contract,
      }
    ]
  })
}

InvestmentService.findOneByLoanIdAndInvestorId = async (loanId, investorId) => {
  return await Investment.findOne({ 
    where: { 
      loanId, investorId 
      ,
      [Op.not] : {
        status : [INVESTMENT_STATUS.CANCEL,INVESTMENT_STATUS.FAIL]
      } 
    } ,
    attributes : ['id']
  });
};

InvestmentService.findOneById = async (id) => {
  return await Investment.findOne({
    where : {
      id,
      [Op.not] : {
        status : [INVESTMENT_STATUS.CANCEL,INVESTMENT_STATUS.FAIL]
      }  
    },
    include : 
    [
      {
        model : db.Loan
      },
      {
        model : db.Transaction,
        require : false
      }
    ]
  })
}

InvestmentService.updateOne = async (id,investmentInfo) => {
  const investment = await Investment.update(investmentInfo, {
    where: { id },
    returning: true,
    plain: true,
  });
  return investment[1];
};

InvestmentService.updateByLoanId = async (loanId,investmentInfo) => {
  const investment = await Investment.update(investmentInfo, {
    where: { loanId },
    returning : true
  });
  return investment;
};

InvestmentService.deleteOne = async (id) => {
  const investment = await Investment.update(
    { status: "inactive" },
    { where: { id }, returning: true, plain: true }
  );
  return investment[1];
};

module.exports = InvestmentService;
