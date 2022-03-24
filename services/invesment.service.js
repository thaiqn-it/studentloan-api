const { Investment, Sequelize } = require("../models");
const db = require("../models/index");
const { INVESTMENT_STATUS } = require('../models/enum')
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
            attributes: ["id","firstname","lastname","profileUrl"],
            include : [
              {
                model : db.SchoolMajor,
                attributes: ["id"],
                include : [
                  { model : db.Major, attributes: ["name"] },
                  { model : db.School, attributes: ["name"], },
                ]
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

InvestmentService.count = async (loanId,investorId) => {
  return Investment.count({ where: { loanId, investorId } })
  .then(count => {
    if (count != 0) {
      return true;
    }
    return false;
  });
};

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

InvestmentService.deleteOne = async (id) => {
  const investment = await Investment.update(
    { status: "inactive" },
    { where: { id }, returning: true, plain: true }
  );
  return investment[1];
};

module.exports = InvestmentService;
