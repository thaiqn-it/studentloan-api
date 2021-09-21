const { Invesment } = require("../models");

const InvesmentService = {};

InvesmentService.getAll = async (investorId) => {
  return await Invesment.findAll({ where: { investorId } });
};

InvesmentService.createOne = async (InvesmentInfo) => {
  return await Invesment.create(InvesmentInfo);
};

InvesmentService.findOne = async (id, investorId) => {
  return await Invesment.findOne({ where: { id, investorId } });
};

InvesmentService.updateOne = async (InvesmentInfo) => {
  return await Invesment.update(InvesmentInfo);
};

InvesmentService.deleteOne = async (id) => {
  return await Invesment.update({ status: "inactive" }, { where: { id } });
};

module.exports = InvesmentService;
