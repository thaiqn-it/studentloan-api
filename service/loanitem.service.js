const { LoanItem } = require("../model/loanitem.model");

const findAllLoanItemService = async () => {
  return await LoanItem.findAll();
};

const createLoanItemService = async (loanItem) => {
  return await LoanItem.create(loanItem);
};

module.exports = { findAllLoanItemService, createLoanItemService };