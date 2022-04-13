const db = require("../models/index");

const findAll = async () => {
  return await db.LoanSchedule.findAll();
};

const findAllByLoanId = async (id) => {
  return await db.LoanSchedule.findAll({
    where: {
      loanId: id,
    },
    order: [["startAt", "ASC"]],
  });
};

const findById = async (id) => {
  return await db.LoanSchedule.findByPk(id);
};

const create = async (data) => {
  return await db.LoanSchedule.bulkCreate(data, { returning: true });
};

const updateById = async (id, data) => {
  const loanSchedule = await db.LoanSchedule.update(data, {
    where: {
      id: id,
    },
    returning: true,
    plain: true,
  });
  return loanSchedule[1];
};

exports.loanScheduleService = {
  findAll,
  findById,
  create,
  updateById,
  findAllByLoanId,
};
