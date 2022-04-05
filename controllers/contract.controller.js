const { contractService } = require("../services/contract.service");
const { INTERNAL_SERVER_ERROR, NOT_FOUND,BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");
  
const findByLoanId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const contract = await contractService.getByLoanId(id);
        if (contract === null) throw new Error();
		return res.json({
            url : contract.contractUrl
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

exports.contractController = { 
    findByLoanId
};