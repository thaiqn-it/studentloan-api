const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require("http-status");
const walletService = require("../services/wallet.service");
const transactionService = require("../services/transaction.service");
const { loanScheduleService } = require("../services/loanSchedule.service");
const {
  loanScheduleTransactionService,
} = require("../services/loanScheduleTransaction.service");
const { restError } = require("../errors/rest");
const moment = require("moment");
const { WALLET_TYPE, TRANSACTION_STATUS, LOAN_SCHEDULE_STATUS } = require("../models/enum");

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
    const { id } = req.params;
    const { money } = req.body;
    if (money < 0) {
      const balance = await walletService.getBalanceById(id);
      if (balance.money < Math.abs(money)) {
        return res
          .status(BAD_REQUEST)
          .json(restError.BAD_REQUEST.extra({ error: "Số dư ví không đủ" }));
      }
    }
    const account = await walletService.updateMoneyById(id, money);
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

const repayment = async (req, response) => {
  try {
    const user = req.user;
    const { loanschedule, investments } = req.body;

    var studentWallet = null;
    var transaction = null;

    walletService.getWalletByUserId(user.id).then((resp) => {
      studentWallet = resp;
      walletService
        .updateMoneyById(resp.id, -parseInt(loanschedule.money))
        .then((resp) => {
          transactionService
            .createTransactionService({
              money: parseInt(loanschedule.money),
              type: WALLET_TYPE.TRANSFER,
              description: `Thanh toán kỳ hạn_${moment(
                loanschedule.startAt
              ).format("MM/YYYY")}_${loanschedule.id}`,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionFee: 0,
              recipientId: null,
              recipientName: "StudentLoanPlatform",
              senderId: user.id,
              senderName: user.firstName + user.lastName,
              walletId: studentWallet.id,
            })
            .then((res) => {
              transaction = res;
              var data = {
                transactionId: res.id,
                loanScheduleId: loanschedule.id,
              };
              loanScheduleTransactionService.create(data).then((res) => {
                var investorWallet = null;
                investments.map((investment) => {
                  var investorUser = investment.Investor.User;
                  walletService
                    .getWalletByUserId(investorUser.id)
                    .then((res) => {
                      investorWallet = res;
                      walletService
                        .updateMoneyById(
                          res.id,
                          parseInt(loanschedule.money * investment.percent)
                        )
                        .then((res) => {
                          transactionService
                            .createTransactionService({
                              money: parseInt(
                                loanschedule.money * investment.percent
                              ),
                              type: WALLET_TYPE.TRANSFER,
                              description: `${
                                user.firstName + user.lastName
                              }_thanh toán kỳ hạn_${moment(
                                loanschedule.startAt
                              ).format("MM/YYYY")}`,
                              status: TRANSACTION_STATUS.SUCCESS,
                              transactionFee: 0,
                              recipientId: investorUser.id,
                              recipientName:
                                investorUser.firstName + investorUser.lastName,
                              senderId: user.id,
                              senderName: user.firstName + user.lastName,
                              walletId: investorWallet.id,
                            })
                            .then((res) => {
                              var data = {
                                transactionId: res.id,
                                loanScheduleId: loanschedule.id,
                              };
                              loanScheduleTransactionService.create(data);
                            });
                        });
                    });
                });
                var data = {status: LOAN_SCHEDULE_STATUS.COMPLETED}
                loanScheduleService.updateById(loanschedule.id, data).then((res) => {
                  response.json(res);
                });
              });
            });
        });
    });
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
  getByUserId,
  repayment,
};
