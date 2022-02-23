const { Investment } = require("../models");
const db = require("../models/index");

const InvestmentService = {};

InvestmentService.getAll = async (id) => {
  return await Investment.findAll({
    where : {
      investorId : id
    },
    include : [
      {
        model : db.Loan,
        include : [
          {
            model : db.LoanSchedule
          }
        ]
      }
    ]
  });
};

InvestmentService.createOne = async (InvestmentInfo) => {
  return await Investment.create(InvestmentInfo);
};

InvestmentService.findOne = async (id, investorId) => {
  return await Investment.findOne({ where: { id, investorId } });
};

InvestmentService.updateOne = async (id,investmentInfo) => {
  const investment = await Investment.update(investmentInfo, {
    where: { id },
    returning: true,
    plain: true,
  });
  return investment[1];
};

InvestmentService.deleteOne = async (id) => {
  const investment = await Investment.update(
    { status: "inactive" },
    { where: { id }, returning: true, plain: true }
  );
  return investment[1];
};

module.exports = InvestmentService;
