const { loanService } = require("../services/loan.service");
const { INTERNAL_SERVER_ERROR, NOT_FOUND,BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");
  
const findAll = async (req, res, next) => {
    try {
        const data = req.body;
        const loans = await loanService.findAll(data);
        return res.json(loans);
    } catch (error) {
        return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};

const findById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const loan = await loanService.findById(id);
        if (loan === null) throw new Error();
		return res.json({
			loan,
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

const create = async (req, res, next) => {
    const errors = validationResult(req); 
		if (!errors.isEmpty()) {
			return res.status(BAD_REQUEST).json(
				restError.BAD_REQUEST.extra({
					errorParams: mapErrorArrayExpressValidator(errors.array()),
				})
			);
		}
    const data = req.body
    try {      
        const loan = await loanService.create(data)
        return res.json(loan);
    } catch (error) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};

const updateById = async (req,res,next) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const loan = await loanService.updateById(id, data)
        if (loan === null) throw new Error();
		return res.json({
			loan,
		});
    } catch (error) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(restError.INTERNAL_SERVER_ERROR.default());
    }
}

const search = async (req,res,next) => {
    const { 
        page,
        sort,
     } = req.params;
    const data = req.body;
    try {
        const loan = await loanService.updateById(id, data)
        if (loan === null) throw new Error();
		return res.json({
			loan,
		});
    } catch (error) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(restError.INTERNAL_SERVER_ERROR.default());
    }
}

exports.loanController = { 
    findAll,
    findById,
    create,
    updateById,
    search
};