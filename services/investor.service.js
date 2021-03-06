const { Investor } = require("../models");
const { INVESTOR_STATUS } = require("../models/enum");
const db = require("../models/index");
const op = db.Sequelize.Op;
const InvestorService = {};

InvestorService.getAll = async () => {
  return await Investor.findAll();
};

InvestorService.getUserById = async (id) => {
  return await Investor.findOne({
    where: {
      userId: id,
      status: INVESTOR_STATUS.ACTIVE,
      parentId: {
        [op.not]: null,
      },
    },
    include: [
      {
        model: db.User,
      },
    ]
  });
}

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

InvestorService.updateOneByParentId = async (id, investorInfo) => {
  const invest = await Investor.update(
    investorInfo,
    { where: { parentId : id }, returning: true, plain: true }
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
