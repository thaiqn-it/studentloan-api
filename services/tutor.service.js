const db = require("../models");

const Tutor = db.Tutor;

const create = async (data) => {
  return await Tutor.create(data);
};

const update= async (data) => {
  let tutor = await Tutor.findByPk(data.id);
  if (tutor === null) throw new Error();
  tutor = { ...tutor, ...data };
  return tutor.save();
};

const getById = async (id) => {
  return await Tutor.findByPk(id);
};

const deleteById = async (id) => {
  const tutor = await Tutor.findByPk(id);
  if (tutor === null) throw new Error();
  //change status
  return await tutor.save();
};

const getByUserId = async (userId) => {
  const tutor = await Tutor.findOne({ 
    where:{ 
        userId: userId
    } 
  });
  if (tutor === null) throw new Error();
  return tutor;    
};

module.exports = {
  create,
  update,
  deleteById,
  getById,
  getByUserId
};
