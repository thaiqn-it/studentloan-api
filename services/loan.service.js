const db = require("../models/index");
const { Op } = require('sequelize');
const moment = require('moment');
const { LOAN_STATUS, INVESTMENT_STATUS, INVESTOR_STATUS, STUDENT_STATUS } = require('../models/enum')
const Investment = db.Investment

const findAll = async () => {
  return await db.Loan.findAll({
    include : [
      {
        model : db.Student,
        attributes: ["firstname","lastname","profileUrl"],
        include : [
          {
            model : db.SchoolMajor,
            attributes: ["id"],
            include : [
              { model : db.Major, attributes: ["name"] },
              { model : db.School, attributes: ["name"], }
            ]
          }
        ]
      },
    ]
  })
};

const findById = async (id) => {
  return await db.Loan.findOne({
    where : {
      id : id
    },
    attributes: {
      include: [
        [db.sequelize.literal('(SELECT COUNT(*) FROM Investment WHERE Investment.loanId = Loan.id)'), 'InvestorCount'],
        [db.sequelize.literal('(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id)'), 'AccumulatedMoney']
      ]
    },
    include : [
      {
        model : db.Student,
        attributes: ["id"],
        include : [
          {
            model : db.SchoolMajor,
            attributes: ["id"],
            include : [
              { model : db.Major, attributes: ["name"] },
              { model : db.School, attributes: ["name"], },
            ]
          },
          {
            model : db.Archievement,
          },
          {
            model : db.User,
            attributes: ["firstname","lastname","profileUrl"],
          }
        ]
      },
      {
        required: false,
        model : db.LoanMedia,
        where : {
          type : 'EVIDENCE'
        }
      }
    ],
   
  });
};

const create = async ({ ...data }) => {
  return await db.Loan.create(data);
};

const getMatchingLoan = async () => {
  return await db.Loan.findAll({
    attributes: {
      include: [
        [db.sequelize.literal("(SELECT ISNULL(SUM(total),0) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')"), 'AccumulatedMoney']
      ]
    },
    where : {
      status : LOAN_STATUS.FUNDING,
      [Op.or] : [
      {
        postExpireAt : {
          [Op.lte] : new Date()
        }
      },
      {
        totalMoney : {
          [Op.eq] : db.sequelize.literal("(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')")
        }
      }
      ]    
    },
    include : [
      {
        model : db.Investment,
        where : {
          [Op.not] : {
            status : [INVESTMENT_STATUS.CANCEL,INVESTMENT_STATUS.FAIL]
          } 
        },
        include : [
          {
            model : db.Investor,
            attributes: ["id"],
            where : {
              status : INVESTOR_STATUS.ACTIVE,
            },
            include : [
              {
                model : db.User,
                attributes: ["firstName","lastName","email","phoneNumber","address"]
              },
              {
                model : db.Investor,
                as : 'Information',
                attributes: ["citizenId","citizenCardCreatedDate","citizenCardCreatedPlace"],
                where : {
                  status : INVESTOR_STATUS.ACTIVE,
                  parentId : {
                    [Op.not] : null
                  }
                }
              }
            ]
          }
        ],
        require : false
      },
      {
        model : db.Student,
        attributes: ["userId"],
        include :[
        {
          model : db.User,
          attributes: ["firstName","lastName","email","phoneNumber","address","birthDate"]
        },
        {      
          model : db.Student,
          as : 'Information',
          attributes: ["citizenId","citizenCardCreatedDate","citizenCardCreatedPlace"],
          where : {
            status : STUDENT_STATUS.ACTIVE,
            parentId : {
              [Op.not] : null
            }
          }   
        }]
      }
    ],
  });
};

const updateById = async (id,data) => {
  return await db.Loan.update(data, {
    where: {
      id
    }
  })
};

const search = async (data) => {
  const PAGE_LIMIT = 5;
  const sort = data.sort;

  const TODAY = moment().format("YYYY-MM-DD HH:mm:ss.mmm +07:00")
  const YESTERDAY = moment().subtract(1,"day").format("YYYY-MM-DD HH:mm:ss.mmm +07:00")

  var s = []
  var q = {
    status : LOAN_STATUS.FUNDING,
    postExpireAt : {
      [Op.gt] : new Date(),
    } 
  }
  var a = {
    include: [
      [db.sequelize.literal('(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id)'), 'AccumulatedMoney']
    ]
  }

  var qSchool = {}
  if (data.schoolMajorId) {
    Object.assign(qSchool,{
      schoolMajorId : data.schoolMajorId
    })
  }

  if (sort === 'lastest') {
    s.push(['postCreatedAt', 'DESC'])    
  } else if (sort === 'endingSoon') {
    s.push(['postExpireAt', 'ASC'])  
  } else if (sort === 'popular') {
    s.push([[db.sequelize.literal('PopularCount'), 'DESC']]) 
    Object.assign(a,{
      include: [
        [db.sequelize.literal('(SELECT COUNT(*) FROM Investment WHERE Investment.loanId = Loan.id AND createdAt BETWEEN ' + "N'"+ YESTERDAY +"'" + ' AND ' + "N'"+ TODAY +"'" + ' )'), 'PopularCount'],
        [db.sequelize.literal('(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id)'), 'AccumulatedMoney']
      ]
    })
  }
  return await db.Loan.findAll({
    offset: (data.page - 1) * PAGE_LIMIT, 
    limit: PAGE_LIMIT,
    order : s,
    where : q,
    attributes: a,
    include : [
      {
        model : db.Student,
        attributes: ["id"],
        where : qSchool,
        include : [
          {
            model : db.SchoolMajor,
            attributes: ["id"],
            include : [
              { model : db.Major, attributes: ["name"] },
              { model : db.School, attributes: ["name"], }
            ]
          },
          {
            model : db.User,
            attributes: ["firstname","lastname","profileUrl"],
          }
        ]
      },
    ]
  })
};

exports.loanService = { 
    findAll, 
    findById,
    create,
    updateById,
    search,
    getMatchingLoan
};