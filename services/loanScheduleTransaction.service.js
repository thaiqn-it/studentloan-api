const db = require("../models");

const create = async (data) => {
  return db.LoanScheduleTransaction.create(data);
};

exports.loanScheduleTransactionService = {
  create,
};
