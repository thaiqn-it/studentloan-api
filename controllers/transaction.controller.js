const { INTERNAL_SERVER_ERROR } = require("http-status");
const transactionService = require("../services/transaction.service");
const { restError } = require("../errors/rest");

const createTransaction = async (req, res) => {
  try {
    const { money, type, description, methodId, from, to, walletId, status } =
      req.body;
    const data = {
      money,
      type,
      description,
      methodId,
      from,
      to,
      walletId,
      status,
    };
    const transaction = await transactionService.createTransactionService(data);
    res.json(transaction);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const updateTransaction = async (req, res) => {
  try {
    const id = req.params;
    const { money, type, description, methodId, from, to, walletId, status } =
      req.body;
    const data = {
      id,
      money,
      type,
      description,
      methodId,
      from,
      to,
      walletId,
      status,
    };
    const transaction = await transactionService.updateTransactionService(data);
    res.json(transaction);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const getTransaction = async (req, res) => {
  try {
    const id = req.params;
    const transaction = await transactionService.getTransactionService(id);
    res.json(transaction);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const id = req.params;
    const transaction = await transactionService.deleteTransactionService(id);
    res.json(transaction);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

exports.transactionController = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransaction,
};
