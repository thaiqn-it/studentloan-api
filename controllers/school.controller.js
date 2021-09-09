const { schoolService } = require("../services/school.service");
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("http-status");
const { restError } = require("../errors/rest");

const findAllUniversity = async (req, res, next) => {
    try {
      const schools = await schoolService.getAll();
      console.log(schools);
      return res.json(schools);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  module.exports = { findAllUniversity };