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

const getOne = async (req, res, next) => {
    try {     
        const config = await systemConfigService.getOne();
        return res.json(config);
    } catch (error) {
        return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};

const create = async (req, res, next) => {
    const data = req.body;
    try {
      const config = await systemConfigService.create(data);
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

const update = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const config = await systemConfigService.update(id, data);
      return res.json(config);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

exports.systemConfigController = { 
    findAll,
    findInterest,
    findFixedMoney,
    findTransactionFee,
    getOne,
    create,
    update
};