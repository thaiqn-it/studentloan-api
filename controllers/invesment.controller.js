const InvestmentService = require("../services/invesment.service");
const { INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../errors/rest");
const { INVESTMENT_STATUS } = require('../models/enum')

const InvestmentController = {};

InvestmentController.getAllInvestment = async (req, res, next) => {
  try {
    const { id } = req.params
    const investments = await InvestmentService.getAllByInvestorId(id);
    return res.json(investments);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

InvestmentController.createInvestment = async (req, res, next) => {
  const {
    interest,
    total,
    investorId,
    loanId,
  } = req.body;
  try {
    const data = {
      status : INVESTMENT_STATUS.PENDING,
      interest,
      total,
      investorId,
      loanId,
    }
    const investment = await InvestmentService.createOne(data);
    // const Investment = await create(req.body);
    return res.json(investment);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

InvestmentController.updateInvestment = async (req, res, next) => {
  const { isDonate, startDay, endDay, interest, status, total } = req.body;

  const { id } = req.params;
  try {
    const investment = await InvestmentService.updateOne(id, {
      isDonate,
      startDay,
      endDay,
      interest,
      status,
      total,
    });
    // const Investment = await create(req.body);
    return res.json(investment);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

InvestmentController.deleteInvestment = async (req, res, next) => {
  const { id } = req.params;
  try {
    const investment = await InvestmentService.deleteOne(id);
    // const Investment = await create(req.body);
    return res.json(investment);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

module.exports = InvestmentController;
