const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("http-status");
const { restError } = require("../errors/rest");
const { schoolServices } = require("../services/school.service");

const findAllSchool = async (req, res, next) => {
  try {
    const schools = await schoolServices.findAllSchool();
    return res.json(schools);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};
const findOneSchool = async (req, res, next) => {
  const { id } = req.params;
  try {
    const school = await schoolServices.findOneSchool(id);
    return res.json(school);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const createNewSchool = async (req, res, next) => {
  const data = req.body;
  try {
    const newSchool = await schoolServices.createNewSchool(data);
    return res.json(newSchool);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};

const updateSchool = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const newSchoolForUpdate = await schoolServices.updateById(id, data);
    return res.json(newSchoolForUpdate);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default);
  }
};
exports.schoolControllers = {
  findAllSchool,
  findOneSchool,
  createNewSchool,
  updateSchool,
};
