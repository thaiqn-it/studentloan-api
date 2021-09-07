const {
    findAllLoanItem,
    createLoanItem,
    updateLoanItem
  } = require("..//loanitem.");
  const { INTERNAL_SERVER_ERROR } = require("http-status");
  const { restError } = require("../error/rest");
  
  const findAllLoanItem = async (req, res, next) => {
    try {
      const listLoanItem = await findAllLoanItem();
      console.log(listLoanItem);
      return res.json(listLoanItem);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };
  
  const createLoanItem = async (req, res, next) => {
    const { remainMoney, paidDay, loanPayId } = req.body;
    try {
      const newLoanItem = await createLoanItem({ remainMoney, paidDay, loanPayId });
      return res.json(newLoanItem);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  const updateLoanItem = async(req,res,next) => {
    const{remainMoney, paidDay, loanPayId} = req.body;
    try {
      const updatedLoanItem = await updateLoanItem({remainMoney, paidDay, loanPayId});
      return res.json(updatedLoanItem);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  }
  
  module.exports = { findAllLoanItem, createLoanItem, updateLoanItem};