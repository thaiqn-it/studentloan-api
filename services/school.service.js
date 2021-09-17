const db = require("../models/index");
const School = db.School;
const findAllSchoolService = async () => {
  return await School.findAll();
};

const createSchoolService = async (school) => {
  return await School.create(school);
};

module.exports = { findAllSchoolService, createSchoolService };
