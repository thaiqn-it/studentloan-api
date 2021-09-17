const db = require("../models/index");

const findAll = async () => {
  return await db.Loan.findAll();
};

const findById = async (id) => {
  return await db.Loan.findByPk(id);
};

const create = async ({ ...data }) => {
  return await db.Loan.create(data);
};

const updateById = async (id,data) => {
  return loan = await db.Loan.update(data, {
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