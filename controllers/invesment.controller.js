const InvestmentService = require("../services/invesment.service");
const { INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../errors/rest");

const InvestmentController = {};

InvestmentController.getAllInvestment = async (req, res, next) => {
  try {
    const investments = await InvestmentService.getAll();
    return res.json(investments);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

InvestmentController.createInvestment = async (req, res, next) => {
  const {
    isDonate,
    startDay,
    endDay,
    interest,
    status,
    total,
    studentId,
    investorId,
    loanAccountId,
  } = req.body;
  try {
    const investment = await InvestmentService.createOne({
      isDonate,
      startDay,
      endDay,
      interest,
      status,
      total,
      studentId,
      investorId,
      loanAccountId,
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