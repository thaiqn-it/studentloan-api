const { Op } = require("sequelize");
const db = require("../models");
const { WALLET_STATUS, USER_TYPE } = require("../models/enum");
const Wallet = db.Wallet;

const create = async (wallet) => {
  return await Wallet.create(wallet);
};

const updateMoneyById = async (id, money) => {
  return await Wallet.increment(
    { money },
    {
      where: {
        id,
      },
    }
  );
};

const updateMoneyByUserId = async (userId, money) => {
  return await Wallet.increment(
    { money },
    {
      where: {
        userId,
      },
    }
  );
};

const getBalanceById = async (id) => {
  return await Wallet.findOne({
    where: {
      id,
    },
    attributes: ["money"],
  });
};

const getOneById = async (id) => {
  return await Wallet.findByPk(id);
};

const deleteById = async (id) => {
  const account = await Wallet.findByPk(id);
  if (account === null) throw new Error();
  Wallet.status = WALLET_STATUS.INACTIVE;
  return await Wallet.save();
};

const getWalletByUserId = async (user) => {
  var temp = {
    model: db.Investor,
    attributes: ["id"],
    require: false,
    where: {
      parentId: {
        [Op.is]: null,
      },
    },
  };
  var includeType = temp;
  if (user.type === USER_TYPE.STUDENT) {
    includeType = { ...temp, model: db.Student };
  }
  const wallet = await Wallet.findOne({
    where: {
      userId: user.id,
    },
    include: {
      model: db.User,
      attributes: ["type", "firstName", "lastName"],
      include: includeType,
    },
    raw: true,
    nest: true,
  });
  if (wallet === null) throw new Error();

  return wallet;
};

module.exports = {
  create,
  updateMoneyById,
  getOneById,
  deleteById,
  getWalletByUserId,
  getBalanceById,
  updateMoneyByUserId,
};
