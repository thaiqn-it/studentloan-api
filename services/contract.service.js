const { Op } = require("sequelize");
const { CONTRACT_STATUS, LOAN_STATUS } = require("../models/enum");
const db = require("../models/index");

const create = async (data) => {
  return await db.Contract.create(data)
};

const getByInvestmentId = async (investmentId) => {
    return await db.Contract.findOne({
        where : {
            investmentId,
            status : CONTRACT_STATUS.ACTIVE
        }
    })
}

const getAllByLoanId = async (loanId) => {
  return await db.Contract.findAll({
      attributes: ["id"],
      include : {
        model : db.Investment,
        attributes: ["id"],
        where : {
          loanId
        }
      }
  })
}

const getAllByInvestorId = async (investorId) => {
    return await db.Contract.findAll({
        include : [
            {
              model : db.Investment,
              where : {
                investorId
              },
              attributes: ["total","id"],
              include : {
                model : db.Loan,
                attributes: ["interest","loanStartAt","loanEndAt"],
                required : true,
                include : [
                {
                  model : db.Student,
                  attributes: ["id"],
                  include : {
                    model : db.User,
                    attributes: ["firstName","lastName"],
                  }
                },
                {
                  model : db.LoanHistory,
                  attributes: ["type"],
                  where : {
                      type : {
                        [Op.or] : [
                          LOAN_STATUS.ONGOING,
                          LOAN_STATUS.FINISH
                        ]
                      },
                      isActive : true
                  }
                }]
              }
            },
        ],
        attributes: ["id","contractCode","contractUrl"],
    })
}

exports.contractService = { 
    create,
    getByInvestmentId,
    getAllByInvestorId,
    getAllByLoanId
};
