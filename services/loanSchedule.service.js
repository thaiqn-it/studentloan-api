const { LOAN_SCHEDULE_STATUS, INVESTMENT_STATUS } = require("../models/enum");
const db = require("../models/index");
const { Op } = require('sequelize');

const findAll = async () => {
  return await db.LoanSchedule.findAll();
};

const findAllByLoanId = async (id) => {
  return await db.LoanSchedule.findAll({
    where:{
      loanId:id
    },
    order : [
      ['startAt', 'ASC']
    ]
    // attributes: {
    //   include: [
    //     [ db.Sequelize.fn('YEAR', db.Sequelize.col('createdAt')), 'year']
    //   ]
    // },
    // raw: true,
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

const getAllExpired = async (id) => {
  return await db.LoanSchedule.findAll({
    where:{
      status : LOAN_SCHEDULE_STATUS.ONGOING,
      endAt : {
        [Op.lte]: new Date()
      },
    },
    include : [
      {
        model : db.Loan,
        attributes: ["penaltyFee"],
        include : [
        {
          model : db.Student,
          attributes: ["id"],
          include : {
            model : db.User,
            attributes: ["id"]
          }
        },
        {
          model : db.Investment,
          attributes: ["id"],
          include : {
            model : db.Investor,
            attributes: ["id"],
            include : {
              model : db.User,
              attributes: ["id"]
            }
          }
        }]
      }
    ]
  });
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
    },
    returning : true,
    plain : true
  })
};

exports.loanScheduleService = { 
    findAll, 
    findById,
    create,
    updateById,
    findAllByLoanId,
    getAllExpired
};