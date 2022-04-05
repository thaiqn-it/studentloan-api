const { contractService } = require("../services/contract.service");
const { INTERNAL_SERVER_ERROR, NOT_FOUND,BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");
  
const findByInvestmentId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const contract = await contractService.getByInvestmentId(id);
        if (contract === null) throw new Error();
		return res.json({
            url : contract.contractUrl
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

const findAllByInvestorId = async (req, res, next) => {
    const investor = req.user.Investor;
    try {
        const contracts = await contractService.getAllByInvestorId(investor.id);
        if (contracts === null) throw new Error();
		return res.json({
            contracts
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

const getOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const school = await contractService.getOne(id);
    return res.json(school);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

exports.contractController = { 
    findByInvestmentId,
    findAllByInvestorId,
    getOne
};
