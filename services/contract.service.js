const { CONTRACT_STATUS } = require("../models/enum");
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

const getAllByInvestorId = async (investorId) => {
    return await db.Contract.findAll({
        include : [
            {
              model : db.Investment,
              where : {
                investorId
              },
            },
          ]
    })
}

exports.contractService = { 
    create,
    getByInvestmentId,
    getAllByInvestorId
};