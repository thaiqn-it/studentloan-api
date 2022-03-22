const {
    NOT_FOUND,
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
  } = require("http-status");
const { restError } = require("../errors/rest");
const {majorService} = require('../services/major.service')

const findAllMajor = async (req, res, next) => {
  const {id} = req.params;
    try {
      const majors = await majorService.findAllMajor(id);
      
      return res.json(majors);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  const createNewMajor = async (req, res, next) => {
    const data = req.body;
    try {
      const newMajor = await majorService.createNewMajor(data);
      return res.json(newMajor);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  const createSubMajor = async (req, res, next) => {
    const data = req.body;
    try {
      const subMajor = await majorService.createNewMajor({data });
      return res.json(subMajor);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  const updateMajor = async (req, res, next) => {
    const data = req.body;
    try {
      const majorUpdated = await majorService.update(data);
      return res.json(majorUpdated);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };
  exports.majorController = {findAllMajor, createNewMajor, createSubMajor, updateMajor}