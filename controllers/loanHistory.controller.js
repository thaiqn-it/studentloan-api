const {
    NOT_FOUND,
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
  } = require("http-status");
const { restError } = require("../errors/rest");
const {loanHistoryService} = require('../services/loanHistory.service')

  const create = async (req, res, next) => {
    const data = req.body;
    try {
      const loanHistory = await loanHistoryService.create(data);
      return res.json(loanHistory);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };

  const updateById = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const loanHistoryUpdated = await loanHistoryService.updateById(id,data);
      return res.json(loanHistoryUpdated);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };
  exports.loanHistoryController = {updateById, create}