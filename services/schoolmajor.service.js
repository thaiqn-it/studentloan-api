const { SchoolMajor } = require("../models");
const db = require("../models/index");
const {SCHOOLMAJOR_STATUS} = require('../models/enum/index')

const findAllSchoolMajor = async () => {
  return await SchoolMajor.findAll();
};

const getAllBySchoolId = async (id) => {
  return await SchoolMajor.findAll({
    where:{
      schoolId:id,
      status:SCHOOLMAJOR_STATUS.ACTIVE
    },
    include:[
      {
        model:db.Major,
        attributes:['name']
      }
    ],
  });
};

const findOneSchoolMajorById = async (majorId, schoolId) => {
  return await SchoolMajor.findOne({
    where: {
      majorId: majorId,
      schoolId: schoolId,
      status:SCHOOLMAJOR_STATUS.ACTIVE
    },
  });
};

const createNewSchoolMajor = async (schoolMajor) => {
  return await SchoolMajor.create(schoolMajor);
};

const updateSchoolMajor = async (id,data) => {
  return await SchoolMajor.update(data,{
    where: {
      id:id,
    },
  });
};

exports.schoolMajorServices = {
  findAllSchoolMajor,
  findOneSchoolMajorById,
  createNewSchoolMajor,
  updateSchoolMajor,
  getAllBySchoolId
};
