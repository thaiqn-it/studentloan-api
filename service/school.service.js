const { School } = require("../model/School.model");

const findAllSchoolService = async () => {
  return await School.findAll();
};

const createSchoolService = async (school) => {
  return await School.create(school);
};

module.exports = { findAllSchoolService, createSchoolService };
