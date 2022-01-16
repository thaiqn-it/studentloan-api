const db = require("../models/index");

const findAll = async () => {
  return await db.LoanSchedule.findAll();
};

const findById = async (id) => {
  return await db.LoanSchedule.findByPk(id);
};

const create = async (data) => {
  return await db.LoanSchedule.bulkCreate(data, {returning: true})
};

const updateById = async (id,data) => {
  return await db.LoanSchedule.update(data, {
    where: {
      id : id
    }
  })
};

exports.loanScheduleService = { 
    findAll, 
    findById,
    create,
    updateById,
};