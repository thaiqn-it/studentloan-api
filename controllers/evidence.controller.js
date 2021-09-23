const EvidenceService = require("../services/Evidence.service");
const { INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../errors/rest");

const EvidenceController = {};

EvidenceController.getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const evidence = await EvidenceService.getById(id);
    return res.json(evidence);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send(restError.INTERNAL_SERVER_ERROR.default);
  }
};

EvidenceController.createEvidence = async (req, res, next) => {
  const { description, status } = req.body;
  try {
    const evidence = await EvidenceService.createOne({
      description,
      status,
    });
    return res.json(evidence);
  } catch (error) {
    console.log(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send(restError.INTERNAL_SERVER_ERROR.default);
  }
};

EvidenceController.updateEvidence = async (req, res, next) => {
  const { id } = req.params;
  const { description } = req.body;
  try {
    const evidence = await EvidenceService.updateOne(id, {description});
    return res.json(evidence);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send(restError.INTERNAL_SERVER_ERROR.default);
  }
};

EvidenceController.deleteEvidence = async (req, res, next) => {
  const { id } = req.params;
  try {
    const evidence = await EvidenceService.deleteOne(id);
    return res.json(evidence);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send(restError.INTERNAL_SERVER_ERROR.default);
  }
};

module.exports = EvidenceController;
