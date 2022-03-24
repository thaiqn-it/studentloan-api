const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require("http-status");
const walletService = require("../services/wallet.service");
const { restError } = require("../errors/rest");

const create = async (req, res) => {
  try {
    const { userId, money, type, status } = req.body;
    const data = { userId, money, type, status };
    const account = await walletService.create(data);
    res.json(account);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const updateMoneyById = async (req, res) => {
  try {
    const { id }= req.params;
    const { money } = req.body;
    if (money < 0) {
      const balance = await walletService.getBalanceById(id)
      if (balance.money < Math.abs(money)) {
        return res
          .status(BAD_REQUEST)
          .json(restError.BAD_REQUEST.extra({ error: "Số dư ví không đủ" }));
      }
    }
    const account = await walletService.updateMoneyById(id,money);
    res.json(account);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const deleteById = async (req, res) => {
  try {
    const id = req.params;
    const account = await walletService.getOneById(id);
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
    const account = await walletService.getWalletByUserId(user.id);
    res.json(account);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

exports.walletController = {
  create,
  updateMoneyById,
  deleteById,
  getByUserId
};
