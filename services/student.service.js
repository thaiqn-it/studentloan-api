const { STUDENT_STATUS } = require("../models/enum");
const db = require("../models/index");

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
    },
    include: [
      {
        model: db.Archievement,
        // where:{
        //   status:"ACTIVE"
        // }
      },
    ],
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
};

exports.studentService = {
  findAll,
  findById,
  create,
  updateById,
  findByUserId,
  createNewStudent,
  updateNewStudentById,
};
