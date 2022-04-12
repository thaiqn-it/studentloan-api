const { Op } = require("sequelize");
const { LOANMEDIA_TYPE, LOANMEDIA_STATUS } = require("../models/enum");
const db = require("../models/index");

const getAllEvidenceByLoanId = async (loanId) => {
    return await db.LoanMedia.findAll({
        where : {
            loanId,
            type : LOANMEDIA_TYPE.DEMANDNOTE,
            status : LOANMEDIA_STATUS.ACTIVE
        }
    })
}



exports.loanMediaService = { 
    getAllEvidenceByLoanId
};
