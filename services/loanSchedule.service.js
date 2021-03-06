const { LOAN_SCHEDULE_STATUS, INVESTMENT_STATUS, LOAN_STATUS } = require("../models/enum");
const db = require("../models/index");
const { Op } = require("sequelize");

const findAll = async () => {
  return await db.LoanSchedule.findAll();
};

const getTotalMoneyCompleted = async () => {
  return await db.LoanSchedule.sum('money', {
    where : {
      status : LOAN_SCHEDULE_STATUS.COMPLETED
    }
  });
};

const findAllByLoanId = async (id, userId) => {
  return await db.LoanSchedule.findAll({
    where: {
      loanId: id,
      status: {
        [Op.not]: null,
      },
    },
    order: [["startAt", "ASC"]],
    include : {
      required : false,
      model : db.LoanScheduleTransaction,
      attributes: ["id"],
      include : {
        required : true,
        model : db.Transaction,
        attributes: ["id"],
        where : {
          recipientId : userId
        }
      }
    }
  });
};

const findAllByLoanIdOption = async (id, option) => {
  return await db.LoanSchedule.findAll({
    where: {
      loanId: id,
      status: {
        [Op.not]: option,
      },
    },
    order: [["startAt", "ASC"]],
  });
};

// const countInterest = async (investorId) => {
//   return db.LoanSchedule.findAll({
//     where : {
//       status : LOAN_SCHEDULE_STATUS.COMPLETED
//     },
//     include : {
//       attributes:['id'],
//       model : db.Loan,
//       include : {
//         model : db.Investment,
//         where : {
//           investorId,
//           status : INVESTMENT_STATUS.INVESTED
//         }
//       }
//     }
//   })
// };

const countIncompleted = async (loanId) => {
  return db.LoanSchedule.count({
    where : {
      status : LOAN_SCHEDULE_STATUS.INCOMPLETE,
      loanId
    },
    include : {
      attributes:['id'],
      model : db.Loan,
      include : {
        model : db.LoanHistory,
        where : {
          type : LOAN_STATUS.ONGOING,
          isActive : true
        }
      }
    }
  })
};

const getAllExpired = async (id) => {
  return await db.LoanSchedule.findAll({
    where: {
      status: LOAN_SCHEDULE_STATUS.ONGOING,
      endAt: {
        [Op.lte]: new Date(),
      },
    },
    include: [
      {
        model: db.Loan,
        attributes: ["penaltyFee"],
        include: [
          {
            model: db.Student,
            attributes: ["id"],
            include: {
              model: db.User,
              attributes: ["id"],
            },
          },
          {
            model: db.Investment,
            attributes: ["id"],
            include: {
              model: db.Investor,
              attributes: ["id"],
              include: {
                model: db.User,
                attributes: ["id"],
              },
            },
          },
        ],
      },
    ],
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
  getAllExpired,
  findAllByLoanIdOption,
  getTotalMoneyCompleted,
  countIncompleted
};
