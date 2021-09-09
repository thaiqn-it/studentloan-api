const {
  findAllSchoolService,
  createSchoolService,
} = require("../service/school.service");
const { INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../error/rest");

const findAllUniversity = async (req, res, next) => {
  try {
    const students = await findAllSchoolService();
    console.log(students);
    return res.json(students);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const createSchool = async (req, res, next) => {
  const { name, city, district } = req.body;
  try {
    const school = await createSchoolService({ name, city, district });
    return res.json(school);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const createNewUniversity = async (req, res, next) => {};
module.exports = { findAllUniversity, createSchool };
