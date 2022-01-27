const { Investor } = require("../models");

const InvestorService = {};

InvestorService.getAll = async () => {
  return await Investor.findAll();
};

InvestorService.createOne = async (investorInfo) => {
  return await Investor.create(investorInfo);
};

InvestorService.findOne = async (id) => {
  return await Investor.findByPk(id);
};

InvestorService.updateOne = async (id, investorInfo) => {
  const invest = await Investor.update(
    { investorInfo },
    { where: { id }, returning: true, plain: true }
  );

  return invest;
};

InvestorService.deleteOne = async (id) => {
  const investor = await Investor.update(
    { status: "inactive" },
    { where: { id }, returning: true, plain: true }
  );
  return investor[1];
};

InvestorService.getOne = async (id) => {
  const investor = await Investor.findByPk(id);
  return investor;
};

module.exports = InvestorService;