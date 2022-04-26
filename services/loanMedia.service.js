const { Op } = require("sequelize");
const { LOANMEDIA_TYPE, LOANMEDIA_STATUS } = require("../models/enum");
const db = require("../models/index");

const getAllEvidenceByLoanId = async (loanId) => {
  return await db.LoanMedia.findAll({
    where: {
      loanId,
      type: LOANMEDIA_TYPE.DEMANDNOTE,
      status: LOANMEDIA_STATUS.ACTIVE,
    },
  });
};

const getAllTranscriptByLoanId = async (loanId) => {
  return await db.LoanMedia.findAll({
    where: {
      loanId,
      type: LOANMEDIA_TYPE.TRANSCRIPT,
      status: LOANMEDIA_STATUS.ACTIVE,
    },
  });
};

const createLoanMedia = async (data) => {
  return await db.LoanMedia.create(data);
};

const updateLoanMediaById = async (id, data) => {
  const loanMedia = await db.LoanMedia.update(data, {
    where: {
      id: id,
    },
    returning: true,
    plain: true,
  });

  return loanMedia;
};


exports.loanMediaService = {
  getAllEvidenceByLoanId,
  updateLoanMediaById,
  createLoanMedia,
  getAllTranscriptByLoanId
};
