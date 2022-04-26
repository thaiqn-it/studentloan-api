const { loanMediaService } = require("../services/loanMedia.service");
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
} = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");
const { LOANMEDIA_STATUS } = require("../models/enum");

const findAllEvidenceByLoanId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const evidences = await loanMediaService.getAllEvidenceByLoanId(id);
    if (evidences === null) throw new Error();
    return res.json({
      evidences,
    });
  } catch (error) {
    return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
  }
};

const findAllTranscriptByLoanId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const transcripts = await loanMediaService.getAllTranscriptByLoanId(id);
    if (transcripts === null) throw new Error();
    return res.json({
      transcripts
    });
  } catch (error) {
    return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
  }
};

const createLoanMedia = async (req, res) => {
  try {
    const data = req.body;
    const newData = { ...data, status: LOANMEDIA_STATUS.ACTIVE };

    const loanMedia = await loanMediaService.createLoanMedia(newData);
    if(loanMedia == null) throw new Error()
    res.json(loanMedia);
  } catch (err) {
    console.log(err);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const updateLoanMedia = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const loanMedia = await loanMediaService.updateLoanMediaById(id, data);
    if(loanMedia == null) throw new Error()
    res.json(loanMedia);
  } catch (err) {
    console.log(err);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};


exports.loanMediaController = {
  findAllEvidenceByLoanId,
  createLoanMedia,
  updateLoanMedia,
  findAllTranscriptByLoanId
};
