const db = require("../models/index");
const { ACHIEVEMENT_STATUS } = require("../models/enum");

const getByStudentId = async (id) => {
  return await db.Archievement.findAll({
    where: {
      studentId: id,
      status: ACHIEVEMENT_STATUS.ACTIVE,
    },
  });
};

const createByStudentId = async (data) => {
  return await db.Archievement.create(data);
};

const updateById = async (id, data) => {
  return await db.Archievement.update(data, {
    where: {
      id: id,
    },
  });
};

exports.achievementService = {
  getByStudentId,
  createByStudentId,
  updateById
};
