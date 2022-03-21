const { userStatusService } = require("../services/userStatus.service");
const { INTERNAL_SERVER_ERROR, NOT_FOUND,BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult, body } = require("express-validator");
const { USERSTATUS_TYPE } = require("../models/enum")
  
const create = async (req, res, next) => {
    const data = req.body
    try {     
        const userStatus = await userStatusService.create(data);
        return res.json(userStatus);
    } catch (error) {
        return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};

const update = async (req, res, next) => {
    const { id } = req.params
    const data = req.body
    try {     
        const userStatus = await userStatusService.updateById(id,data);
        return res.json(userStatus);
    } catch (error) {
        return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};

const getOne = async (req, res, next) => {
    const { id } = req.params
    try {
      const userList = await userStatusService.findById(id);
      return res.json(userList);
    } catch (e) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default());
    }
  };

exports.userStatusController = { 
    create,
    update,
    getOne
};