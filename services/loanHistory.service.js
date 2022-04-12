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

const getOneByLoanId = async (loanId) => {

    return await LoanHistory.findOne({
        where : {
            loanId,
            isActive : true
        },
        include : [
        {
            model : db.LoanHistoryImage,
            where : {
                status : 'ACTIVE'
            },
            required : false
        },
        {
            model : db.User,
            where : {
                status : 'VERIFIED'
            },
            attributes: ["firstname", "lastname"],
            required : false
        }]
    })
}

module.exports.loanHistoryService = {
    create,
    updateById,
    updateByLoanId,
    getOneByLoanId
};
