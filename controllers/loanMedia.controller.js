const { loanMediaService } = require("../services/loanMedia.service");
const { INTERNAL_SERVER_ERROR, NOT_FOUND,BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");
  
const findAllEvidenceByLoanId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const evidences = await loanMediaService.getAllEvidenceByLoanId(id);
        if (evidences === null) throw new Error();
		return res.json({
            evidences
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};


exports.loanMediaController = { 
    findAllEvidenceByLoanId
};
