const db = require("../models");
const LoanHistory = db.LoanHistory;

const create = async (data) => {
  return await LoanHistory.create(data);
};

const updateById = async (id,data) => {
    return await LoanHistory.update(data, {
        where : {
            id : id
        }
    })
}

const updateByLoanId = async (loanId,data) => {
    return await LoanHistory.update(data, {
        where : {
            loanId
        }
    })
}

module.exports.loanHistoryService = {
    create,
    updateById,
    updateByLoanId
};
