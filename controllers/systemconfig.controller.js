const { systemConfigService } = require("../services/systemconfig.service");
const { INTERNAL_SERVER_ERROR, NOT_FOUND,BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");
  
const findAll = async (req, res, next) => {
    try {     
        const config = await systemConfigService.getAll();
        return res.json(config);
    } catch (error) {
        return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};

const findInterest = async (req, res, next) => {
    try {
        const { interest } = await systemConfigService.getInterest();
        if (interest === null) throw new Error();
		return res.json({
			interest
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

const findTransactionFee = async (req, res, next) => {
    try {
        const { transactionFee } = await systemConfigService.getTransactionFee();
        if (transactionFee === null) throw new Error();
		return res.json({
			transactionFee
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

const findFixedMoney = async (req, res, next) => {
    try {
        const { fixedMoney } = await systemConfigService.getFixedMoney();
        if (fixedMoney === null) throw new Error();
		return res.json({
			fixedMoney
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

exports.systemConfigController = { 
    findAll,
    findInterest,
    findFixedMoney,
    findTransactionFee
};