const db = require("../models");
const { SYSTEM_CONFIG_TYPE } = require("../models/enum");
const SystemConfig = db.SystemConfig;

const getAll = async () => {
    return await SystemConfig.findAll();
};

const getInterest = async () => {
    return await SystemConfig.findOne({
        where : {
            status : true
        },
        attributes: ['interest']
    });
};

const getTransactionFee = async () => {
    return await SystemConfig.findOne({
        where : {
            status : true
        },
        attributes: ['transactionFee']
    });
};

const getFixedMoney = async () => {
    return await SystemConfig.findOne({
        where : {
            status : true
        },
        attributes: ['fixedMoney']
    });
};

exports.systemConfigService = {
  getAll,
  getInterest,
  getFixedMoney,
  getTransactionFee
};
