const {
    NOT_FOUND,
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
  } = require("http-status");
const { restError } = require("../errors/rest");
const {schoolMajorServices} = require('../services/schoolmajor.service')

const findAllSchoolMajor = async (req, res, next) => {
    try {
      const schoolMajors = await schoolMajorServices.findAllSchoolMajor();
      return res.json(schoolMajors);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  const findOneSchoolMajor = async (req, res, next) => {
    const {majorId, schoolId} = req.params;
    try {
      const schoolMajor = await schoolMajorServices.findOneSchoolMajorById(majorId, schoolId);
      return res.json(schoolMajor);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  const getAllBySchoolId = async (req, res, next) => {
    try {
      const {id} = req.params
      const schoolMajors = await schoolMajorServices.getAllBySchoolId(id);
      return res.json(schoolMajors);
    } catch (error) {
      console.log(error)
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };
  
  const createNewSchoolMajor = async (req, res, next) => {
    const data = req.body;
    try {
      const newSchool = await schoolMajorServices.createNewSchoolMajor(data);
      return res.json(newSchool);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };
  
  const updateSchoolMajor = async (req, res, next) => {
    try {
      const {id} =req.params
      const data = req.body;
      const newSchoolMajorForUpdate = await schoolMajorServices.updateSchoolMajor(id,data);
      return res.json(newSchoolMajorForUpdate);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };
  exports.schoolMajorControllers = {findAllSchoolMajor, findOneSchoolMajor, createNewSchoolMajor, updateSchoolMajor
  ,getAllBySchoolId}