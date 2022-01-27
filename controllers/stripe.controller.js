const { INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../errors/rest");
const stripeService = require("../services/stripeService");

const getAccount = async (req, res, next) => {};

const createAccount = async (req, res, next) => {
  try {
    const data = req.body;
    const account = await stripeService.createAccount(data);
    if (!account) throw new Error();
    res.json(account);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const getAccountBalance = async (req, res, next) => {
  try {
    const accountId = req.params.accountId;

    const account = await stripeService.getAccountBalance(accountId);

    if (!account) throw new Error();
    res.json(account);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const transfer = async (req, res, next) => {
  try {
    const data = req.body;
    const transfer = await stripeService.transfer(data);
    if (!transfer) throw new Error();
    res.json(transfer);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const topup = async (req, res, next) => {
  try {
    const { amount, description } = req.body;
    const topup = await stripeService.transfer(amount, description);
    if (!topup) throw new Error();
    res.json(topup);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const charge = async (req, res, next) => {
  try {
    const { amount, description, source } = req.body;
    const charge = stripeService.reversal(amount, description, source);
    if (!charge) throw new Error();
    res.json(charge);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

module.exports = { getAccountBalance, transfer, createAccount, topup, charge};