const { achievementService } = require("../services/achievement.service");
const { restError } = require("../errors/rest");
const { ACHIEVEMENT_STATUS } = require("../models/enum");

const createByStudentId = async (req, res, next) => {
  try {
    const data = req.body;
    const newData = {
      ...data,
      studentId: req.user.Student.id,
      status: ACHIEVEMENT_STATUS.ACTIVE,
    };
    const achievement = achievementService.createByStudentId(newData);
    if (achievement === null) throw new Error();

    return res.json(achievement);
  } catch (error) {
    return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
  }
};

const updateById = async (req, res, next) => {
  try {
    const data = req.body;
    const { id, ...newData } = data;
    const achievement = achievementService.updateById(id, newData);
    if (achievement === null) throw new Error();

    return res.json(achievement);
  } catch (error) {
    return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
  }
};

const getByStudentId = async (req, res, next) => {
  try {
    const achievements = await achievementService.getByStudentId(req.user.Student.id);
    if (achievements === null) throw new Error();

    return res.json(achievements);
  } catch (error) {
    return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
  }
};

exports.achievementController = {
  createByStudentId,
  updateById,
  getByStudentId,
};
