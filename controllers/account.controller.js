const { INTERNAL_SERVER_ERROR } = require("http-status");
const accountService = require("../services/account.service");
const { restError } = require("../errors/rest");

const createAccount = async (req, res) => {
  try {
    const { userId, money, type, status } = req.body;
    const data = { userId, money, type, status };
    const account = await accountService.createAccountService(data);
    res.json(account);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const updateAccount = async (req, res) => {
  try {
    const { id }= req.params;
    const { money } = req.body;
    
    const account = await accountService.updateAccountService(id,money);
    res.json(account);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const id = req.params;
    const account = await accountService.getByUserId(id);
    res.json(account);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const getByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await accountService.getWalletByUserId(id);
    res.json(account);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

exports.accountController = {
  createAccount,
  updateAccount,
  deleteAccount,
  getByUserId
};
