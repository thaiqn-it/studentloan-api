const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require("http-status");
const walletService = require("../services/wallet.service");
const transactionService = require("../services/transaction.service");
const { loanScheduleService } = require("../services/loanSchedule.service");
const {
  loanScheduleTransactionService,
} = require("../services/loanScheduleTransaction.service");
const { restError } = require("../errors/rest");
const moment = require("moment");
const {
  WALLET_TYPE,
  TRANSACTION_STATUS,
  LOAN_SCHEDULE_STATUS,
  USER_TYPE,
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
} = require("../models/enum");
const InvestmentService = require("../services/invesment.service");
const firebaseService = require("../services/firebase.service");
const notificationService = require("../services/notification.service");
const userService = require("../services/user.service");

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
    const account = await walletService.getWalletByUserId(user);
    if (account.User.type === USER_TYPE.INVESTOR) {
      const totalPending = await InvestmentService.sumTotalPendingByInvetorId(
        account.User.Investor.id
      );
      if (totalPending) {
        Object.assign(account, {
          totalPending,
        });
      } else {
        Object.assign(account, {
          totalPending: 0,
        });
      }
    }
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
    const { loanSchedule, investments } = req.body;

    var studentWallet = null;
    var transaction = null;

    walletService.getWalletByUserId(user).then((resp) => {
      studentWallet = resp;
      walletService
        .updateMoneyById(resp.id, -parseInt(loanSchedule.money))
        .then((resp) => {
          transactionService
            .createTransactionService({
              money: parseInt(loanSchedule.money),
              type: WALLET_TYPE.TRANSFER,
              description: `Thanh toán kỳ hạn_${moment(
                loanSchedule.startAt
              ).format("MM/YYYY")}`,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionFee: 0,
              recipientId: null,
              recipientName: "Các nhà đầu tư",
              senderId: user.id,
              senderName: user.firstName + " " + user.lastName,
              walletId: studentWallet.id,
            })
            .then((res) => {
              transaction = res;
              var data = {
                transactionId: res.id,
                loanScheduleId: loanSchedule.id,
              };
              loanScheduleTransactionService.create(data).then((res) => {
                var investorWallet = null;
                investments.map((investment) => {
                  var investorUser = investment.Investor.User;
                  walletService.getWalletByUserId(investorUser).then((res) => {
                    investorWallet = res;
                    walletService
                      .updateMoneyById(
                        res.id,
                        parseInt(loanSchedule.money * investment.percent)
                      )
                      .then((res) => {
                        transactionService
                          .createTransactionService({
                            money: parseInt(
                              loanSchedule.money * investment.percent
                            ),
                            type: WALLET_TYPE.RECEIVE,
                            description: `${
                              user.firstName + user.lastName
                            }_thanh toán kỳ hạn_${moment(
                              loanSchedule.startAt
                            ).format("MM/YYYY")}`,
                            status: TRANSACTION_STATUS.SUCCESS,
                            transactionFee: 0,
                            recipientId: investorUser.id,
                            recipientName:
                              investorUser.firstName +
                              " " +
                              investorUser.lastName,
                            senderId: user.id,
                            senderName: user.firstName + " " + user.lastName,
                            walletId: investorWallet.id,
                          })
                          .then((res) => {
                            var data = {
                              transactionId: res.id,
                              loanScheduleId: loanSchedule.id,
                            };
                            loanScheduleTransactionService
                              .create(data)
                              .then(async () => {
                                const { pushToken } =
                                  await userService.getPushTokenByUserId(
                                    investorUser.id
                                  );
                                if (pushToken) {
                                  firebaseService.pushNotificationService(
                                      `${pushToken}`,
                                      {
                                          "notification" : {
                                              "body" : `Sinh viên đã thanh toán kỳ hạn tháng ${moment(
                                                loanSchedule.startAt
                                              ).format("MM/YYYY")}`,
                                              "title": "Thông báo",
                                              "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23",
                                              "image" : "https://res.cloudinary.com/larrytran/image/upload/v1651638169/image/logo_duwoyg.png"
                                          },
                                          "data" : {
                                              "experienceId": "@thainq2k/student-loan-app-client",
                                              "scopeKey": "@thainq2k/student-loan-app-client",
                                              "title": "Thông báo",
                                              "message": `Sinh viên đã thanh toán kỳ hạn tháng ${moment(
                                                loanSchedule.startAt
                                              ).format("MM/YYYY")}`,
                                              "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23"
                                      }
                                  })
                              }
                              
                              notificationService.create({
                                userId : investorUser.id,
                                redirectUrl : `myapp://investmentDetail/${investment.id}`,
                                description : `Sinh viên đã thanh toán kỳ hạn tháng ${moment(
                                  loanSchedule.startAt
                                ).format("MM/YYYY")}`,
                                isRead : false,
                                type : NOTIFICATION_TYPE.LOAN,
                                status : NOTIFICATION_STATUS.ACTIVE
                              })
                            });
                          });
                      });
                  });
                });
                var data = { status: LOAN_SCHEDULE_STATUS.COMPLETED };
                loanScheduleService
                  .updateById(loanSchedule.id, data)
                  .then((res) => {
                    response.json(res);
                  });
              });
            });
        });
    });
  } catch (err) {
    response
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const repaymentAll = async (req, response) => {
  try {
    const user = req.user;
    const { loanSchedules, investments } = req.body;

    var studentWallet = null;
    var transaction = null;
    var flag = false;
    var total = 0;

    loanSchedules.map((item) => {
      total += parseFloat(item.money);
    });

    await walletService.getWalletByUserId(user).then((resp) => {
      studentWallet = resp;
      walletService.updateMoneyById(resp.id, -total).then((resp) => {
        transactionService
          .createTransactionService({
            money: total,
            type: WALLET_TYPE.TRANSFER,
            description: `Thanh toán hoàn toàn khoản nợ`,
            status: TRANSACTION_STATUS.SUCCESS,
            transactionFee: 0,
            recipientId: null,
            recipientName: "Các nhà đầu tư",
            senderId: user.id,
            senderName: user.firstName + " " + user.lastName,
            walletId: studentWallet.id,
          })
          .then((res) => {
            transaction = res;
            loanSchedules.map((item) => {
              var data = {
                transactionId: res.id,
                loanScheduleId: item.id,
              };
              loanScheduleTransactionService.create(data);
            });

            var investorWallet = null;
            investments.map((investment) => {
              var investorUser = investment.Investor.User;
              walletService.getWalletByUserId(investorUser).then((res) => {
                investorWallet = res;
                walletService
                  .updateMoneyById(res.id, parseInt(total * investment.percent))
                  .then(async (res) => {
                    transactionService
                      .createTransactionService({
                        money: parseInt(total * investment.percent),
                        type: WALLET_TYPE.RECEIVE,
                        description: `Thanh toán hoàn toàn khoản nợ`,
                        status: TRANSACTION_STATUS.SUCCESS,
                        transactionFee: 0,
                        recipientId: investorUser.id,
                        recipientName:
                          investorUser.firstName + " " + investorUser.lastName,
                        senderId: user.id,
                        senderName: user.firstName + " " + user.lastName,
                        walletId: investorWallet.id,
                      })
                      .then((res) => {
                        loanSchedules.map((item) => {
                          var data = {
                            transactionId: res.id,
                            loanScheduleId: item.id,
                          };
                          loanScheduleTransactionService.create(data);
                        });
                      });

                          const { pushToken } = await userService.getPushTokenByUserId(investorUser.id)
                          if (pushToken) {
                              firebaseService.pushNotificationService(
                                  `${pushToken}`,
                                  {
                                      "notification" : {
                                          "body" : `Sinh viên đã thanh toán hoàn toàn khoản nợ.`,
                                          "title": "Thông báo",
                                          "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23",
                                          "image" : "https://res.cloudinary.com/larrytran/image/upload/v1651638169/image/logo_duwoyg.png"
                                      },
                                      "data" : {
                                          "experienceId": "@thainq2k/student-loan-app-client",
                                          "scopeKey": "@thainq2k/student-loan-app-client",
                                          "title": "Thông báo",
                                          "message": `Sinh viên đã thanh toán hoàn toàn khoản nợ.`,
                                          "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23"
                                  }
                              })
                          }
                          
                          notificationService.create({
                            userId : investorUser.id,
                            redirectUrl : `myapp://investmentDetail/${investment.id}`,
                            description : `Sinh viên đã thanh toán hoàn toàn khoản nợ.`,
                            isRead : false,
                            type : NOTIFICATION_TYPE.LOAN,
                            status : NOTIFICATION_STATUS.ACTIVE
                          })
                      });
                    }

                    notificationService.create({
                      userId: investorUser.id,
                      redirectUrl: `myapp://investmentDetail/${investment.id}`,
                      description: `Sinh viên đã thanh toán hoàn toàn khoản nợ.`,
                      isRead: false,
                      type: NOTIFICATION_TYPE.LOAN,
                      status: NOTIFICATION_STATUS.ACTIVE,
                    });
                  });
              });
            });

            flag = true;
            var data = { status: LOAN_SCHEDULE_STATUS.COMPLETED };
            loanSchedules.map((item) => {
              loanScheduleService.updateById(item.id, data).catch((err) => {
                flag = false;
                response.json({
                  messge: "Thanh toán Thất bại",
                  success: flag,
                });
              });
            });
            
          });
      });
    });
    response.json({ messge: "Thanh toán thành công", success: flag });
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
  repaymentAll,
};
