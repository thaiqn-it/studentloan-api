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

const findByType = async (req, res, next) => {
    const { type } = req.params;
    try {
        const config = await systemConfigService.getByType(type);
        if (config === null) throw new Error();
        const value = config.value
		return res.json({
			value
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

exports.systemConfigController = { 
    findAll,
    findByType
};