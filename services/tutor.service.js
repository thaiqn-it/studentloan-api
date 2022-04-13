const db = require("../models");
const { TUTOR_STATUS } = require("../models/enum");
const { Op } = require("sequelize");

const Tutor = db.Tutor;

const create = async (data) => {
  return await Tutor.create(data);
};

const update = async (data) => {
  let tutor = await Tutor.findByPk(data.id);
  if (tutor === null) throw new Error();
  await tutor.update({ ...data });
  return tutor;
};

const getById = async (id) => {
  return await Tutor.findByPk(id);
};

const getListTutorByStudentId = async (id) => {
  return await Tutor.findAll({
    where: {
      studentId: id,
      status: {
        [Op.not]: TUTOR_STATUS.DELETED,
      },
    },
  });
};

const deleteById = async (id) => {
  const tutor = await Tutor.findByPk(id);
  if (tutor === null) throw new Error();
  //change status

  return await tutor.update({ status: TUTOR_STATUS.DELETED });
};

const getByUserId = async (userId) => {
  const tutor = await Tutor.findOne({
    where: {
      userId: userId,
    },
  });
  if (tutor === null) throw new Error();
  return tutor;
};

module.exports = {
  create,
  update,
  deleteById,
  getById,
  getByUserId,
  getListTutorByStudentId,
};
