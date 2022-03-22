const db = require("../models");
const { TRANSACTION_STATUS } = require("../models/enum");
const Transaction = db.Transaction;

const createTransactionService = async (transaction) => {
  return await Transaction.create(transaction);
};

const updateTransactionService = async (data) => {
  let transaction = await Transaction.findByPk(data.id);
  if (transaction === null) throw new Error();
  transaction = { ...transaction, ...data };
  return transaction.save();
};

const getTransactionService = async (id) => {
  return await Transaction.findByPk(id);
};

const deleteTransactionService = async (id) => {
  const transaction = await Transaction.findByPk(id);
  if (transaction === null) throw new Error();
  transaction.status = TRANSACTION_STATUS.DELETED;
  return await transaction.save();
};

const getTransactionsByWalletId = async (accountId) => {
  const transactions = await Transaction.findAll({
    attributes: {
      include: [
        // [ db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')), 'month'],
        [ db.Sequelize.fn('FORMAT', db.Sequelize.col('createdAt'), 'dd-MM-yyyy'), 'date']
      ]
    },
    raw : true,
    where: { accountId },
    order : [
      ['createdAt', 'DESC']
    ]
  });

  return transactions;
};

module.exports = {
  createTransactionService,
  updateTransactionService,
  deleteTransactionService,
  getTransactionService,
  getTransactionsByWalletId,
};
