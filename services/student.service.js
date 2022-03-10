const db = require("../models/index");

const findAll = async () => {
  return await db.Student.findAll();
};

const findById = async (id) => {
  return await db.Student.findByPk(id);
};

const findByUserId = async (id) => {
  return await db.Student.findOne({
    where:{
      userId:id
    },
    include:[{
      model: db.Archievement,
      // where:{
      //   status:"ACTIVE"
      // }
    }]
  });
};

const create = async ({ ...data }) => {
  return await db.Student.create(data);
};

const updateById = async (id,data) => {
  return await db.Student.update(data, {
    where: {
      id : id
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