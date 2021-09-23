const { Evidence } = require("../models");

const EvidenceService = {};

EvidenceService.getById = async (id) => {
  return await Evidence.findByPk(id);
};

EvidenceService.createOne = async (evidenceInfo) => {
  return await Evidence.create(evidenceInfo);
};

EvidenceService.updateOne = async (id, evidenceInfo) => {
  const evidence = await Evidence.update(evidenceInfo, {
    where: { id },
    returning: true,
    plain: true,
  });
  return evidence[1];
};

EvidenceService.deleteOne = async (id) => {
  const evidence = await Evidence.update(
    { status: "inactive" },
    { where: { id }, returning: true, plain: true }
  );
  return evidence[1];
};

module.exports = EvidenceService;
