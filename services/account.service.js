const db = require("../models");
const { ACCOUNT_STATUS } = require("../models/enum");
const Account = db.Account;

const createAccountService = async (account) => {
  return await Account.create(account);
};

const updateAccountService = async (id,money) => {
  return await Account.increment(
    { money }, 
    { where: 
      { 
        id
      } 
    })
};

const getBalanceByAccountId = async (id) => {
  return await Account.findOne({
    where : {
      id
    },
    attributes: ["money"]
  })
}

const getAccountService = async (id) => {
  return await Account.findByPk(id);
};

const deleteAccountService = async (id) => {
  const account = await account.findByPk(id);
  if (account === null) throw new Error();
  account.status = ACCOUNT_STATUS.INACTIVE;
  return await account.save();
};

const getWalletByUserId = async (userId) => {
  const wallet = await Account.findOne({ where: { userId } });
  if (wallet === null) throw new Error();

  return wallet;
};

module.exports = {
  createAccountService,
  updateAccountService,
  getAccountService,
  deleteAccountService,
  getWalletByUserId,
  getBalanceByAccountId
};
