const {
    NOT_FOUND,
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
  } = require("http-status");
const { restError } = require("../errors/rest");
const {majorService} = require('../services/major.service')

const findAllMajor = async (req, res, next) => {
    try {
      const majors = await majorService.findAllMajor();
      console.log(majors);
      return res.json(majors);
    } catch (error) {
      console.log(error);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  const findOneMajor = async (req, res, next) => {
    const {id} = req.params;
    try {
      const major = await majorService.findOneMajor(id);
      console.log(major);
      return res.json(major);
    } catch (error) {
      console.log(error);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  const createNewMajor = async (req, res, next) => {
    const { name } = req.body;
    try {
      const newMajor = await majorService.createNewMajor({ name });
      return res.json(newMajor);
    } catch (error) {
      console.log(error)
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
      console.log(error)
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  const updateMajor = async (req, res, next) => {
    const {id} = req.params;
    const {data} = req.body;
    try {
      const newMajorForUpdate = await majorService.updateById( id , data );
      return res.json(newMajorForUpdate);
    } catch (error) {
      console.log(error)
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };
  exports.majorController = {findAllMajor, createNewMajor, createSubMajor, updateMajor, findOneMajor}