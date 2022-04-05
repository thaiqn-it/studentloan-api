const {
    NOT_FOUND,
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
  } = require("http-status");
const { restError } = require("../errors/rest");
const {loanHistoryImageService} = require('../services/loanHistoryImage.service')

  const create = async (req, res, next) => {
    const data = req.body;
    try {
      const loanHistoryImage = await loanHistoryImageService.create(data);
      return res.json(loanHistoryImage);
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
      const loanHistoryImageUpdated = await loanHistoryImageService.updateById(id,data);
      return res.json(loanHistoryImageUpdated);
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
  };
  exports.loanHistoryImageController = {updateById, create}