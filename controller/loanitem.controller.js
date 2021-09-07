const {
    findAllLoanItemService,
    createLoanItemService,
    updateLoanItemService
  } = require("../service/loanitem.service");
  const { INTERNAL_SERVER_ERROR } = require("http-status");
  const { restError } = require("../error/rest");
  
  const findAllLoanItemService = async (req, res, next) => {
    try {
      const listLoanItem = await findAllLoanItemService();
      console.log(listLoanItem);
      return res.json(listLoanItem);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };
  
  const createLoanItemService = async (req, res, next) => {
    const { remainMoney, paidDay, loanPayId } = req.body;
    try {
      const newLoanItem = await createLoanItemService({ remainMoney, paidDay, loanPayId });
      return res.json(newLoanItem);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  const updateLoanItemService = async(req,res,next) => {
    const{remainMoney, paidDay, loanPayId} = req.body;
    try {
      const updatedLoanItem = await updateLoanItemService({remainMoney, paidDay, loanPayId});
      return res.json(updatedLoanItem);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  }
  
  module.exports = { findAllLoanItemService, createLoanItemService, updateLoanItemService};