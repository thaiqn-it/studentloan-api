const db = require("../models/index");
const { Op } = require("sequelize");
const moment = require("moment");
const {
  LOAN_STATUS,
  LOANHISTORY_ISACTIVE,
  LOANMEDIA_STATUS,
  LOANMEDIA_TYPE,
} = require("../models/enum");

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

const getLoanStudent = async (id) => {
  return await db.Loan.findAll({
    where: {
      studentId: id,
    },
    attributes: {
      include: [
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM Investment WHERE Investment.loanId = Loan.id)"
          ),
          "InvestorCount",
        ],
        [
          db.sequelize.literal(
            "(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id)"
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
          isActive: LOANHISTORY_ISACTIVE.TRUE,
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
  });
};

const findById = async (id) => {
  return await db.Loan.findOne({
    where: {
      id: id,
    },
    attributes: {
      include: [
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM Investment WHERE Investment.loanId = Loan.id)"
          ),
          "InvestorCount",
        ],
        [
          db.sequelize.literal(
            "(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id)"
          ),
          "AccumulatedMoney",
        ],
      ],
    },
    include: [
      {
        model: db.LoanHistory,
        // where: {
        //   isActive: LOANHISTORY_ISACTIVE.TRUE,
        // },
      },
      {
        model: db.Student,
        // attributes: ["id","firstname","lastname","profileUrl","semester"],
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
            required: false,
            model: db.Archievement,
            where: {
              status: "ACTIVE",
            },
          },
          {
            model: db.User,
            attributes: ["firstName", "lastName", "phoneNumber", "email"],
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
        model: db.Contract,
        where: {
          status: "active",
        },
      },
      {
        required: false,
        model: db.Investment,
        include: {
          model: db.Investor,
          attributes: ["id"],
          include: {
            model: db.User,
            attributes: ["firstName", "lastName", "phoneNumber", "email", "profileUrl"],
          },
        },
      },
    ],
  });
};

const create = async ({ ...data }) => {
  const loan = await db.Loan.create(data);
  return loan;
};

const updateById = async (id, data) => {
  return await db.Loan.update(data, {
    where: {
      id: id,
    },
  });
};

const search = async (data) => {
  const PAGE_LIMIT = 5;
  const sort = data.sort;

  const TODAY = moment().format("YYYY-MM-DD HH:mm:ss.mmm +00:00");
  const YESTERDAY = moment()
    .subtract(1, "day")
    .format("YYYY-MM-DD HH:mm:ss.mmm +00:00");

  var s = [];
  var q = {
    status: LOAN_STATUS.FUNDING,
    postExpireAt: {
      [Op.gt]: new Date(),
    },
  };
  var a = {
    include: [
      [
        db.sequelize.literal(
          "(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id)"
        ),
        "AccumulatedMoney",
      ],
    ],
  };

  if (sort === "lastest") {
    s.push(["postCreatedAt", "DESC"]);
  } else if (sort === "endingSoon") {
    s.push(["postExpireAt", "ASC"]);
  } else if (sort === "popular") {
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
              " )"
          ),
          "PopularCount",
        ],
        [
          db.sequelize.literal(
            "(SELECT SUM(total) FROM Investment WHERE Investment.loanId = Loan.id)"
          ),
          "AccumulatedMoney",
        ],
      ],
    });
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

exports.loanService = {
  findAll,
  findById,
  create,
  updateById,
  search,
  getLoanStudent,
};
