const InvestorService = require("../services/investor.service");
const { INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../errors/rest");

const InvestorController = {};

InvestorController.getAllInvestors = async (req, res, next) => {
  try {
    const investors = await InvestorService.getAll();
    return res.json(investors);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

InvestorController.getInvestor = async (req, res, next) => {
  const { id } = req.params;
  try {
    const investor = await InvestorService.getOne(id);
    return res.json(investor);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

InvestorController.createInvestor = async (req, res, next) => {
  const {
    data
  } = req.body;
  try {
    const investor = await InvestorService.createOne(data);
    // const investor = await create(req.body);
    return res.json(investor);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

InvestorController.updateInvestor = async (req, res, next) => {
  const {
    lastName,
    firstName,
    job,
    citizenId,
    frontCitizenCardImageId,
    backCitizenCardImageId,
    type,
    status,
    parentId,
  } = req.body;

  const { id } = req.params;

  try {
    const investor = await InvestorService.updateOne(id, {
      lastName,
      firstName,
      job,
      citizenId,
      frontCitizenCardImageId,
      backCitizenCardImageId,
      type,
      status,
      parentId,
    });
    // const investor = await create(req.body);
    return res.json(investor);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

InvestorController.deleteInvestor = async (req, res, next) => {
  const { id } = req.params;
  try {
    const investor = await InvestorService.deleteOne(id);
    // const investor = await create(req.body);
    return res.json(investor);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

module.exports = InvestorController;
