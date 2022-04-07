const db = require("../models");
const Notification = db.Notification;

const createNotificationService = async (notification) => {
  return await Notification.create(notification);
};

const updateNotificationService = async (data) => {
  let Notification = await Notification.findByPk(data.id);
  if (Notification === null) throw new Error();
  Notification = { ...Notification, ...data };
  return Notification.save();
};

const getNotificationService = async (id) => {
  return await Notification.findByPk(id);
};

const deleteNotificationService = async (id) => {
  const Notification = await Notification.findByPk(id);
  return await Notification.destroy();
};

module.exports = {
  createNotificationService,
  updateNotificationService,
  deleteNotificationService,
  getNotificationService,
};
