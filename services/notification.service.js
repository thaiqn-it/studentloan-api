const db = require("../models");
const Notification = db.Notification;
const { Op } = require('sequelize');

const create = async (notification) => {
  return await Notification.create(notification);
};

const updateById = async (id, data) => {
  return await db.Notification.update(data, {
    where: {
      id
    },
    returning: true,
    plain: true
  })
};

const getAllByUserId = async (userId) => {
  return await db.Notification.findAll({
    where: {
      userId
    },
    order: [
      ['createdAt', 'DESC']
    ]
  })
}

const getTop5TodayByUserId = async (userId, data) => {
  return await db.Notification.findAll({
    where: {
      userId,
      createdAt:
      {
        [Op.between]:
          [data.startDate, data.endDate]
      }
    },
    order: [
      ['createdAt', 'DESC']
    ],
    limit:5,
  })
}

const countIsNotRead = async (userId) => {
  return await db.Notification.count({
    where: {
      userId,
      isRead: false
    }
  })
}

const getOneById = async (id) => {
  return await db.Notification.findOne({
    where: {
      id
    }
  })
};

module.exports = {
  create,
  updateById,
  getAllByUserId,
  countIsNotRead,
  getOneById,
  getTop5TodayByUserId
};
