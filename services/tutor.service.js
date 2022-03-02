const db = require("../models");
const { TUTOR_STATUS } = require("../models/enum");

const Tutor = db.Tutor;

const create = async (data) => {
  const tutor = { ...data, status: TUTOR_STATUS.UNVERIFIED };
  return await Tutor.create(tutor);
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

const deleteById = async (id) => {
  const tutor = await Tutor.findByPk(id);
  if (tutor === null) throw new Error();
  //change status

  return await tutor.update({ status: 'delete' });
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
};
