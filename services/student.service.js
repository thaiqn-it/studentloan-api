const { STUDENT_STATUS } = require("../models/enum");
const { Sequelize } = require("../models/index");
const db = require("../models/index");
const op = db.Sequelize.Op;

const findAll = async () => {
  return await db.Student.findAll();
};

const findById = async (id) => {
  return await db.Student.findByPk(id);
};

const findByUserId = async (id) => {
  return await db.Student.findOne({
    where: {
      userId: id,
      status:STUDENT_STATUS.ACTIVE,
      parentId:{
        [op.not]:null
      }
    }
    ,
    include: [
      {
      model: db.Archievement,
      where: {
        status: "ACTIVE"
      }
    },
    {
      model: db.SchoolMajor,
      include: [
        {
          model: db.School,
          attributes: ["name"],
        },
        {
          model: db.Major,
          attributes: ["name"],
        },
      ]
    },
    {
      model: db.User,
    },
    ]
  });
};

const create = async ({ ...data }) => {
  return await db.Student.create(data);
};

const updateById = async (id, data) => {
  return await db.Student.update(data, {
    where: {
      id: id
    }
  })
};

exports.studentService = {
  findAll,
  findById,
  create,
  updateById,
  findByUserId,
};