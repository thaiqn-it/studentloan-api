const db = require("../models/index");

const findAll = async () => {
  return await db.UserStatus.findAll();
};

const findById = async (id) => {
  return await db.UserStatus.findByPk(id);
};

const create = async (data) => {
  return await db.UserStatus.create(data)
};

const updateById = async (id,data) => {
  return await db.UserStatus.update(data, {
    where: {
      id : id
    }
  })
};

exports.userStatusService = { 
    findAll, 
    findById,
    create,
    updateById,
};