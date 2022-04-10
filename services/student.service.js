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
      status: STUDENT_STATUS.ACTIVE,
      parentId: {
        [op.not]: null
      }
    }
    ,
    include: [
      {
        model: db.Archievement,
        where: {
          status: "ACTIVE"
        },
        required: false
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
        ],
        required: false
      },
      {
        model: db.User,
        attributes:  {exclude: ["password","oAuthId","pushToken","createAt","updateAt"]},
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
      id: id,
    },
  });
};

const createNewStudent = async (data) => {
  const parent = await db.Student.create(data);
  const newStudent = await db.Student.create({ ...data, parentId: parent.id });
  return newStudent;
};

const updateNewStudentById = async (id, data) => {
  const oldStudent = await db.Student.findByPk(id);
  await oldStudent.update({ status: STUDENT_STATUS.INACTIVE });
  const newStudent = { ...oldStudent, ...data };
  return await db.Student.create({ ...newStudent });
}
// const getStudentProfile = async (id) => {
//   return await db.Student.findOne({
//     where: {
//       userId: id,
//       status: STUDENT_STATUS.ACTIVE,
//       parentId: {
//         [op.not]: null
//       }
//     }
//     ,
//     include: [
//       {
//       model: db.Archievement,
//       where: {
//         status: "ACTIVE"
//       }
//     },
//     {
//       model: db.SchoolMajor,
//       include: [
//         {
//           model: db.School,
//           attributes: ["name"],
//         },
//         {
//           model: db.Major,
//           attributes: ["name"],
//         },
//       ]
//     },
//     // {
//     //   model: db.User,
//     //   attributes: ["firstName","lastName","phoneNumber","email","profileUrl"]
//     // },
//     ]
//   });
// };

exports.studentService = {
  findAll,
  findById,
  create,
  updateById,
  findByUserId,
  createNewStudent,
  updateNewStudentById,
  // getStudentProfile
};
