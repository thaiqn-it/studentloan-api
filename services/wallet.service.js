const db = require("../models");
const { WALLET_STATUS } = require("../models/enum");
const Wallet = db.Wallet;

const create = async (wallet) => {
  return await Wallet.create(wallet);
};

const updateMoneyById = async (id,money) => {
  return await Wallet.increment(
    { money }, 
    { where: 
      { 
        id
      } 
    })
};

const getBalanceById = async (id) => {
  return await Wallet.findOne({
    where : {
      id
    },
    attributes: ["money"]
  })
}

const getOneById = async (id) => {
  return await Wallet.findByPk(id);
};

const deleteById = async (id) => {
  const account = await Wallet.findByPk(id);
  if (account === null) throw new Error();
  Wallet.status = WALLET_STATUS.INACTIVE;
  return await Wallet.save();
};

const getWalletByUserId = async (userId) => {
  const wallet = await Wallet.findOne({ where: { userId } });
  if (wallet === null) throw new Error();

  return wallet;
};

module.exports = {
  create,
  updateMoneyById,
  getOneById,
  deleteById,
  getWalletByUserId,
  getBalanceById
};
