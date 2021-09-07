const { LoanItem } = require("../models/loanitem");

const findAllLoanItem = async () => {
  return await LoanItem.findAll();
};

const createLoanItem = async (loanItem) => {
  return await LoanItem.create(loanItem);
};

const updateLoanItem = async (LoanItem) => {
  return await LoanItem.update(LoanItem,{

  });
}

module.exports = { findAllLoanItem, createLoanItem, updateLoanItem };