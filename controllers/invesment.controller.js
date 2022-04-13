const InvestmentService = require("../services/invesment.service");
const { INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../errors/rest");
const { INVESTMENT_STATUS } = require('../models/enum');
const { loanScheduleService } = require("../services/loanSchedule.service");

const InvestmentController = {};

InvestmentController.getAllByInvestorID = async (req, res, next) => {
  try {
    const investor = req.user.Investor
    const investments = await InvestmentService.getAllByInvestorId(investor.id);
    return res.json(investments);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

InvestmentController.findAllByLoanId = async (req, res, next) => {
  try {
    const {id} = req.params
    const investments = await InvestmentService.findAllByLoanId(id);
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
    percent
  } = req.body;
  try {
    const data = {
      status : INVESTMENT_STATUS.PENDING,
      interest,
      total,
      investorId,
      loanId,
      percent
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
  const data = req.body;
  const { id } = req.params;
  try {
    const investment = await InvestmentService.updateOne(id, data);
    return res.json(investment);
  } catch (error) {
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

InvestmentController.checkExistInvestmentByInvestorId = async (req, res, next) => {
  const investor = req.user.Investor;
  const { id : loanId } = req.params
  try {
    const investment = await InvestmentService.findOneByLoanIdAndInvestorId(loanId,investor.id);
    let result = {}
    if (!investment) {
      result = {
        isInvest : false
      }
    } else {
      result = {
        isInvest : true,
        investmentId : investment.id
      }
    }
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

InvestmentController.findOneById = async (req, res, next) => {
  const { id } = req.params
  try {
    const investment = await InvestmentService.findOneById(id);
    return res.json(investment);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

InvestmentController.countByInvestorId = async (req, res, next) => {
  const investor = req.user.Investor;
  try {
    const countTotal = await InvestmentService.countTotalByInvestorId(investor.id);
    const countPending = await InvestmentService.countPendingByInvestorId(investor.id);
    const countLoanFinish = await InvestmentService.countLoanFinishByInvestorId(investor.id);
    const countLoanOngoing = await InvestmentService.countLoanOngoingByInvestorId(investor.id);
    const totalInvestment = await InvestmentService.sumTotalInvestmentByInvetorId(investor.id);
    const totalPending = await InvestmentService.sumTotalPendingByInvetorId(investor.id);
    const interestMaterial = await InvestmentService.countInterest(investor.id);

    var interestReceived = 0
    var interestUnreceived = 0

    JSON.parse(JSON.stringify(interestMaterial)).forEach(item => {
      interestReceived = interestReceived + parseInt(item.Loan.PaidMoney) * item.percent * item.Loan.duration * item.Loan.interest / (1 + item.Loan.duration * item.Loan.interest)
      interestUnreceived = interestUnreceived + parseInt(item.Loan.UnpaidMoney) * item.percent * item.Loan.duration * item.Loan.interest / (1 + item.Loan.duration * item.Loan.interest)
    })
    
    return res.json({
      total : countTotal,
      pending : countPending,
      loanFinish : countLoanFinish,
      loanOngoing : countLoanOngoing,
      totalInvestment,
      totalPending,
      interestReceived,
      interestUnreceived
    });
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

module.exports = InvestmentController;
