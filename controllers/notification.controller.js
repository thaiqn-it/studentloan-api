const notificationService = require("../services/notification.service");
const userService = require("../services/user.service");
const firebaseService = require("../services/firebase.service");
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
} = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");
const { NOTIFICATION_TYPE, NOTIFICATION_STATUS, USER_TYPE } = require("../models/enum");

const create = async (req, res, next) => {
  const data = req.body;
  try {
    const notification = await notificationService.create(data);
    if (notification === null) throw new Error();
    return res.json({
      notification,
    });
  } catch (error) {
    return res.status(BAD_REQUEST).json(restError.BAD_REQUEST.default());
  }
};

const getAllByUserId = async (req, res, next) => {
  const user = req.user;
  try {
    const notifications = await notificationService.getAllByUserId(user.id);
    const countNotRead = await notificationService.countIsNotRead(user.id);
    if (notifications === null) throw new Error();
    return res.json({
      countNotRead,
      notifications,
    });
  } catch (error) {
    return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
  }
};

const pushNotiToUser = async (req, res, next) => {
    try {
        const data = req.body
        var dataNoti = {
            notification: {
                body: `${data.msg}`,
                title: "Thông báo",
                link: `${data.redirectUrl}`,
            },
            data: {
                experienceId: "@thainq2k/student-loan-app-client",
                scopeKey: "@thainq2k/student-loan-app-client",
                title: "Thông báo",
                message: `${data.msg}`,
                link: `${data.redirectUrl}`,
            },
        }
        const { pushToken } = await userService.getPushTokenByUserId(data.userId)
        if (pushToken) {
            var temp = null
            if (data.type === USER_TYPE.STUDENT) {
                temp = {
                    ...dataNoti, data: {
                        title: "Thông báo",
                        message: `${data.msg}`,
                        click_action: `${data.redirectUrl}`,
                    }
                }
            } else {
                temp = dataNoti
            }
            firebaseService.pushNotificationService(
                `${pushToken}`,
                temp
            )
        }
        const notification = await notificationService.create({
            userId: data.userId,
            redirectUrl: data.redirectUrl,
            description: data.msg,
            isRead: false,
            type: data.notiType,
            status: NOTIFICATION_STATUS.ACTIVE
        });
        if (notification === null) throw new Error();
        return res.json({
            notification
        });
    } catch (error) {
        return res.status(BAD_REQUEST).json(restError.BAD_REQUEST.default());
    }
};

const pushNotifToAdmin = async (req, res, next) => {
  try {
    // const data = req.body
    const { redirectUrl, message } = req.body;
    var noti = [];
    const admins = await userService.getListAdmin();
    admins.map(async (admin) => {
      const { pushToken } = await userService.getPushTokenByUserId(admin.id);
      if (pushToken) {
        firebaseService.pushNotificationService(pushToken, {
          notification: {
            body: message,
            title: "Thông báo",
            image:
              "https://res.cloudinary.com/larrytran/image/upload/v1651637962/file/1651637961475-newLogo3.png",
          },
          data: {
            experienceId: "@thainq2k/student-loan-app-client",
            scopeKey: "@thainq2k/student-loan-app-client",
            title: "Thông báo",
            message: message,
            click_action: redirectUrl,
          },
        });
      }

      var notification = await notificationService.create({
        userId: admin.id,
        redirectUrl: redirectUrl,
        description: message,
        isRead: false,
        type: NOTIFICATION_TYPE.LOAN,
        status: NOTIFICATION_STATUS.ACTIVE,
      });
      noti.push(notification)
    });

    // if (noti.length === 0) throw new Error();
    return res.json({
      noti,
    });
  } catch (error) {
    console.log(error);
    return res.status(BAD_REQUEST).json(restError.BAD_REQUEST.default());
  }
};

const updateById = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const result = await notificationService.updateById(id, data);
    if (result === null) throw new Error();
    const notification = result[1];
    return res.json({
      notification,
    });
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const getOneById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const notification = await notificationService.getOneById(id);
    if (notification === null) throw new Error();
    return res.json({
      notification,
    });
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const getTop5TodayByUserId = async (req, res, next) => {
  const user = req.user;
  const data = req.body;
  try {
    const notifications = await notificationService.getTop5TodayByUserId(
      user.id,
      data
    );
    if (notifications === null) throw new Error();
    return res.json(notifications);
  } catch (error) {
    return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
  }
};

const countByUserId = async (req, res, next) => {
  const user = req.user;
  try {
    const result = await notificationService.countIsNotRead(user.id);
    if (result === null) throw new Error();
    return res.json({
      numOfNotification: result,
    });
  } catch (error) {
    return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
  }
};

exports.notificationController = {
  create,
  getAllByUserId,
  updateById,
  getOneById,
  getTop5TodayByUserId,
  countByUserId,
  pushNotifToAdmin,
  pushNotiToUser
};
