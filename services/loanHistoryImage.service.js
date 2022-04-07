const db = require("../models");
const LoanHistoryImage = db.LoanHistoryImage;

const create = async (data) => {
  return await LoanHistoryImage.create(data);
};

const updateById = async (id,data) => {
    return await LoanHistoryImage.update(data, {
        where : {
            id : id
        }
    })
}

module.exports.loanHistoryImageService = {
    create,
    updateById,
};
