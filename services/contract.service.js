const { CONTRACT_STATUS } = require("../models/enum");
const db = require("../models/index");

const create = async (data) => {
  return await db.Contract.create(data)
};

const getByLoanId = async (loanId) => {
    return await db.Contract.findOne({
        where : {
            loanId,
            status : CONTRACT_STATUS
        }
    })
}

exports.contractService = { 
    create,
    getByLoanId
};