const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require("http-status");
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

const updateByAccountId = async (req, res) => {
  try {
    const { id }= req.params;
    const { money } = req.body;
    if (money < 0) {
      const balance = await accountService.getBalanceByAccountId(id)
      if (balance.money < Math.abs(money)) {
        return res
          .status(BAD_REQUEST)
          .json(restError.BAD_REQUEST.extra({ error: "Số dư ví không đủ" }));
      }
    }
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
    const user = req.user;
    const account = await accountService.getWalletByUserId(user.id);
    res.json(account);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

exports.accountController = {
  createAccount,
  updateByAccountId,
  deleteAccount,
  getByUserId
};
