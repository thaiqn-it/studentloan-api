const db = require("../models/index");
const { Op } = require("sequelize");
const moment = require("moment");
const {
  LOAN_STATUS,
  INVESTMENT_STATUS,
  INVESTOR_STATUS,
  STUDENT_STATUS,
  LOANMEDIA_STATUS,
  SCHOOLMAJOR_STATUS,
  LOANMEDIA_TYPE,
  LOAN_SCHEDULE_STATUS,
  ACHIEVEMENT_STATUS,
} = require("../models/enum");
const { loanHistoryService } = require("./loanHistory.service");
const Investment = db.Investment;

const findAll = async () => {
  return await db.Loan.findAll({
    include: [
      {
        model: db.Student,
        attributes: ["firstname", "lastname", "profileUrl"],
        include: [
          {
            model: db.SchoolMajor,
            attributes: ["id"],
            include: [
              { model: db.Major, attributes: ["name"] },
              { model: db.School, attributes: ["name"] },
            ],
          },
        ],
      },
    ],
  });
};

const getLoanStudent = async (id, typeRes) => {
  var typeOption = {
    [Op.not]: LOAN_STATUS.DELETED,
  };
  if (typeRes !== "null" && typeRes !== "undefined") {
    typeOption = {
      [Op.eq]: typeRes,
    };
  }

  return await db.Loan.findAll({
    where: {
      studentId: id,
    },
    attributes: {
      include: [
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')"
          ),
          "InvestorCount",
        ],
        [
          db.sequelize.literal(
            "(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')"
          ),
          "AccumulatedMoney",
        ],
      ],
    },
    include: [
      {
        model: db.Investment,
      },
      {
        model: db.LoanHistory,
        attributes: ["type"],
        where: {
          isActive: true,
          type: typeOption,
        },
      },
      {
        model: db.LoanMedia,
        attributes: ["imageUrl"],
        where: {
          type: LOANMEDIA_TYPE.VIDEO,
          status: LOANMEDIA_STATUS.ACTIVE,
        },
        required: false,
      },
    ],
    order: [["postCreatedAt", "DESC"]],
  });
};

const findAllWaiting = async (data) => {
  return await db.Loan.findAndCountAll({
    attributes: ["totalMoney", "id", "studentId", "title", "postCreatedAt"],
    order: [["postCreatedAt", data.order]],
    limit: data.limit,
    offset: data.offset,
    include: [
      {
        model: db.Student,
        attributes: ["id", "userId"],
        include: [
          {
            model: db.User,
            attributes: ["id", "firstName", "lastName", "profileUrl"],
          },
          {
            model: db.Student,
            as: "Information",
            attributes: ["id"],
            include: [
              {
                model: db.SchoolMajor,
                attributes: ["id"],
                include: [
                  { model: db.Major, attributes: ["name"] },
                  { model: db.School, attributes: ["name"] },
                ],
              },
            ],
            where: {
              status: STUDENT_STATUS.ACTIVE,
              parentId: {
                [Op.not]: null,
              },
            },
          },
        ],
      },
      {
        model: db.LoanHistory,
        attributes: ["id", "type"],
        where: {
          isActive: true,
          type: data.type,
        },
      },
    ],
  });
};

const countLoan = async (type) => {
  return await db.Loan.count({
    include: [
      {
        model: db.LoanHistory,
        where: {
          type: type,
          isActive: true,
        },
      },
    ],
  });
};

const countLoanBaseTime = async (data) => {
  return await db.Loan.count({
    include: [
      {
        model: db.LoanHistory,
        where: {
          type: data.type,
          isActive: true,
          createdAt: {
            [Op.between]: [data.startDate, data.endDate],
          },
        },
      },
    ],
  });
};

const getOne = async (id) => {
  return await db.Loan.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: db.Student,
        attributes: ["id", "userId"],
        include: [
          {
            model: db.Student,
            as: "Information",
            attributes: ["id"],
            include: [
              {
                model: db.SchoolMajor,
                attributes: ["id"],
                include: [
                  { model: db.Major, attributes: ["name"] },
                  { model: db.School, attributes: ["name"] },
                ],
              },
              {
                model: db.Archievement,
                where: {
                  status: ACHIEVEMENT_STATUS.ACTIVE,
                },
                required: false,
              },
            ],
            where: {
              status: STUDENT_STATUS.ACTIVE,
              parentId: {
                [Op.not]: null,
              },
            },
          },
          {
            model: db.User,
            attributes: ["firstName", "lastName", "profileUrl", "id"],
          },
        ],
      },
      {
        model: db.LoanHistory,
        where: {
          isActive: true,
        },
      },
      {
        model: db.LoanMedia,
        where: {
          status: LOANMEDIA_STATUS.ACTIVE,
        },
        required: false,
      },
    ],
  });
};

const findById = async (id) => {
  return await db.Loan.findOne({
    where: {
      id,
    },
    attributes: {
      include: [
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')"
          ),
          "InvestorCount",
        ],
        [
          db.sequelize.literal(
            "(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')"
          ),
          "AccumulatedMoney",
        ],
        [
          db.sequelize.literal(
            "(SELECT type FROM LoanHistory WHERE LoanHistory.loanId = Loan.id AND LoanHistory.isActive = 'true')"
          ),
          "Status",
        ],
      ],
    },
    include: [
      {
        model: db.Student,
        attributes: ["id"],
        include: [
          {
            required: true,
            model: db.Student,
            as: "Information",
            attributes: ["id"],
            include: {
              required: true,
              model: db.SchoolMajor,
              attributes: ["id"],
              include: [
                { model: db.Major, attributes: ["name"] },
                { model: db.School, attributes: ["name"] },
              ],
            },
          },
          {
            required: false,
            model: db.Archievement,
            where: {
              status: ACHIEVEMENT_STATUS.ACTIVE,
            },
          },
          {
            model: db.User,
            attributes: ["firstname", "lastname", "profileUrl","id"],
          },
        ],
      },
      {
        required: false,
        model: db.LoanMedia,
        where: {
          status: LOANMEDIA_STATUS.ACTIVE,
        },
      },
    ],
  });
};

const findByIdStudentSide = async (id, type) => {
  const include = [
    {
      model: db.LoanHistory,
      include: [
        {
          model: db.LoanHistoryImage,
        },
      ],
      // where: {
      //   isActive: true,
      // },
    },
    {
      required: false,
      model: db.Student,
      attributes: ["id"],
      include: [
        {
          model: db.Student,
          as: "Information",
          attributes: ["id"],
          where: {
            status: STUDENT_STATUS.ACTIVE,
            parentId: {
              [Op.not]: null,
            },
          },
          include: [
            {
              model: db.SchoolMajor,
              attributes: ["id"],
              include: [
                { model: db.Major, attributes: ["name"] },
                { model: db.School, attributes: ["name"] },
              ],
            },
          ],
        },
        {
          required: false,
          model: db.Archievement,
          where: {
            status: "ACTIVE",
          },
        },
        {
          model: db.User,
          attributes: [
            "firstName",
            "lastName",
            "phoneNumber",
            "email",
            "address",
            "birthDate",
          ],
        },
      ],
    },
    {
      required: false,
      model: db.LoanMedia,
      where: {
        status: "active",
      },
    },
    {
      required: false,
      model: db.Investment,
      include: [
        {
          model: db.Investor,
          attributes: ["id"],
          include: {
            model: db.User,
            attributes: [
              "firstName",
              "lastName",
              "phoneNumber",
              "email",
              "profileUrl",
            ],
          },
        },
        {
          required: false,
          model: db.Contract,
          where: {
            status: "active",
          },
        },
      ],
    },
  ];

  var includeCondition = [];
  if (type === "edit") {
    includeCondition = include.filter(
      (item) => item.model !== db.Contract && item.model !== db.Investment
    );

    var indexLoanHistory = includeCondition.findIndex(
      (item) => item.model === db.LoanHistory
    );
    var replaceLoanHistory = {
      model: db.LoanHistory,
      where: {
        isActive: true,
        type: { [Op.not]: LOAN_STATUS.DELETED },
      },
    };
    includeCondition[indexLoanHistory] = replaceLoanHistory;
  } else {
    includeCondition = include;
  }

  return await db.Loan.findOne({
    where: {
      id: id,
    },
    attributes: {
      include: [
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')"
          ),
          "InvestorCount",
        ],
        [
          db.sequelize.literal(
            "(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')"
          ),
          "AccumulatedMoney",
        ],
      ],
    },
    include: includeCondition,
    order: [[db.LoanHistory, "createdAt", "ASC"]],
  });
};

const create = async ({ ...data }) => {
  const loan = await db.Loan.create(data);
  if (loan) {
    var loanHistoryData = {
      loanId: loan.id,
      type: LOAN_STATUS.DRAFT,
      isActive: true,
    };
    const loanHistory = await loanHistoryService.create(loanHistoryData);
  }
  return loan;
};

const getAll = async () => {
  return await db.Loan.findAll({
    attributes: ["id"],
    include: [
      {
        model: db.LoanHistory,
        where: {
          type: LOAN_STATUS.ONGOING,
          isActive: true,
        },
        required: true,
      },
    ],
  });
};

const getFinishLoan = async (id) => {
  return await db.Loan.findOne({
    attributes: ["id"],
    where: {
      id,
    },
    include: [
      {
        model: db.LoanHistory,
        where: {
          type: LOAN_STATUS.ONGOING,
          isActive: true,
        },
        required: true,
      },
      {
        model: db.LoanSchedule,
        attributes: ["id"],
        where: {
          status: [
            LOAN_SCHEDULE_STATUS.ONGOING,
            LOAN_SCHEDULE_STATUS.INCOMPLETE,
          ],
        },
        required: false,
      },
    ],
  });
};

const getMatchingLoan = async () => {
  return await db.Loan.findAll({
    attributes: {
      include: [
        [
          db.sequelize.literal(
            "(SELECT ISNULL(SUM(total),0) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')"
          ),
          "AccumulatedMoney",
        ],
      ],
    },
    where: {
      [Op.or]: [
        {
          postExpireAt: {
            [Op.lte]: new Date(),
          },
        },
        {
          totalMoney: {
            [Op.eq]: db.sequelize.literal(
              "(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')"
            ),
          },
        },
      ],
    },
    include: [
      {
        model: db.Investment,
        where: {
          [Op.not]: {
            status: [INVESTMENT_STATUS.CANCEL, INVESTMENT_STATUS.FAIL],
          },
        },
        include: [
          {
            model: db.Investor,
            attributes: ["id"],
            where: {
              status: INVESTOR_STATUS.ACTIVE,
            },
            include: [
              {
                model: db.User,
                attributes: [
                  "id",
                  "firstName",
                  "lastName",
                  "email",
                  "phoneNumber",
                  "address",
                ],
              },
              {
                model: db.Investor,
                as: "Information",
                attributes: [
                  "citizenId",
                  "citizenCardCreatedDate",
                  "citizenCardCreatedPlace",
                ],
                where: {
                  status: INVESTOR_STATUS.ACTIVE,
                  parentId: {
                    [Op.not]: null,
                  },
                },
              },
            ],
          },
        ],
        required: false,
      },
      {
        model: db.Student,
        attributes: ["userId"],
        include: [
          {
            model: db.User,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "phoneNumber",
              "address",
              "birthDate",
            ],
          },
          {
            model: db.Student,
            as: "Information",
            attributes: [
              "citizenId",
              "citizenCardCreatedDate",
              "citizenCardCreatedPlace",
            ],
            where: {
              status: STUDENT_STATUS.ACTIVE,
              parentId: {
                [Op.not]: null,
              },
            },
          },
        ],
        required: true,
      },
      {
        model: db.LoanHistory,
        where: {
          type: LOAN_STATUS.FUNDING,
          isActive: true,
        },
        required: true,
      },
    ],
  });
};

const updateById = async (id, data) => {
  const loan = await db.Loan.update(data, {
    where: {
      id,
    },
    returning: true,
    plain: true,
  });
  return loan[1];
};

const getTotalById = async (id) => {
  return await db.Loan.findOne({
    attributes: ["totalMoney"],
    where: {
      id,
    },
  });
};

const getLoanDropOut = async () => {
  return await db.Loan.findAll({
    attributes: {
      include: [
        [
          db.sequelize.literal(
            "(SELECT ISNULL(COUNT(id),0) FROM LoanSchedule WHERE LoanSchedule.loanId = Loan.id AND LoanSchedule.status = 'INCOMPLETE')"
          ),
          "CountIncompleted",
        ],
      ],
    },
    where : {
      lastCheck : {
        [Op.or] : [
          null,
          {
            [Op.lte] : moment().subtract(30, 'days').toDate()
          }
        ]
      }
    },
    include : {
      model : db.LoanHistory,
      where : {
        type : LOAN_STATUS.ONGOING,
        isActive : true
      },
      required: true,
    }
  });
};

const search = async (data) => {
  const PAGE_LIMIT = 5;
  const sort = data.sort;

  const TODAY = moment().format("YYYY-MM-DD HH:mm:ss.mmm +07:00");
  const YESTERDAY = moment()
    .subtract(1, "day")
    .format("YYYY-MM-DD HH:mm:ss.mmm +07:00");

  const schoolsSearch = data.schools;
  const majorsSearch = data.majors;

  const minMoney = data.minMoney;
  const maxMoney = data.maxMoney;

  const searchText = data.text;

  var qText = {};
  var s = [];
  var q = {
    postExpireAt: {
      [Op.gt]: new Date(),
    },
  };

  if (searchText) {
    Object.assign(qText, {
      [Op.or]: [
        {
          firstName: {
            [Op.like]: `%${searchText}%`,
          },
        },
        {
          lastName: {
            [Op.like]: `%${searchText}%`,
          },
        },
      ],
    });
  }

  if (minMoney && maxMoney) {
    Object.assign(q, {
      totalMoney: {
        [Op.between]: [parseInt(minMoney), parseInt(maxMoney)],
      },
    });
  }

  var a = {
    include: [
      [
        db.sequelize.literal(
          "(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')"
        ),
        "AccumulatedMoney",
      ],
    ],
  };

  var qSchoolMajor = [];
  if (majorsSearch !== undefined) {
    var qMajorSearch = [];
    majorsSearch.map((item) => {
      qMajorSearch.push({
        majorId: item,
      });
    });
    qSchoolMajor.push({
      [Op.or]: qMajorSearch,
    });
  }

  if (schoolsSearch !== undefined) {
    var qSchoolSearch = [];
    schoolsSearch.map((item) => {
      qSchoolSearch.push({
        schoolId: item,
      });
    });
    qSchoolMajor.push({
      [Op.or]: qSchoolSearch,
    });
  }

  switch (sort) {
    case "lastest":
      s.push(["postCreatedAt", "DESC"]);
      break;
    case "endingSoon":
      s.push(["postExpireAt", "ASC"]);
      break;
    case "popular":
      s.push([[db.sequelize.literal("PopularCount"), "DESC"]]);
      Object.assign(a, {
        include: [
          [
            db.sequelize.literal(
              "(SELECT COUNT(*) FROM Investment WHERE Investment.loanId = Loan.id AND createdAt BETWEEN " +
                "N'" +
                YESTERDAY +
                "'" +
                " AND " +
                "N'" +
                TODAY +
                "'" +
                " AND Investment.status = 'PENDING' )"
            ),
            "PopularCount",
          ],
          [
            db.sequelize.literal(
              "(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id AND Investment.status = 'PENDING')"
            ),
            "AccumulatedMoney",
          ],
        ],
      });
      break;
    case "oldest":
      s.push(["postCreatedAt", "ASC"]);
      break;
    case "moneyUp":
      s.push(["totalMoney", "ASC"]);
      break;
    case "moneyDown":
      s.push(["totalMoney", "DESC"]);
      break;
  }

  return await db.Loan.findAll({
    offset: (data.page - 1) * PAGE_LIMIT,
    limit: PAGE_LIMIT,
    order: s,
    where: q,
    attributes: a,
    include: [
      {
        model: db.Student,
        attributes: ["id"],
        include: [
          {
            required: true,
            model: db.Student,
            as: "Information",
            attributes: ["id"],
            include: {
              required: true,
              model: db.SchoolMajor,
              where: {
                [Op.and]: qSchoolMajor,
                status: SCHOOLMAJOR_STATUS.ACTIVE,
              },
              include: [
                { model: db.Major, attributes: ["name"] },
                { model: db.School, attributes: ["name"] },
              ],
            },
          },
          {
            model: db.User,
            attributes: ["firstname", "lastname", "profileUrl"],
            where: qText,
          },
        ],
        required: true,
      },
      {
        model: db.LoanHistory,
        required: true,
        where: {
          type: LOAN_STATUS.FUNDING,
          isActive: true,
        },
      },
    ],
  });
};

exports.loanService = {
  findAll,
  findById,
  create,
  updateById,
  search,
  getMatchingLoan,
  findAllWaiting,
  getOne,
  countLoan,
  countLoanBaseTime,
  findByIdStudentSide,
  getLoanStudent,
  getFinishLoan,
  getAll,
  getTotalById,
  getLoanDropOut
};
