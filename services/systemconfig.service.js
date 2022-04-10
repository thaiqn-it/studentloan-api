const db = require("../models");
const { SYSTEM_CONFIG_TYPE } = require("../models/enum");
const SystemConfig = db.SystemConfig;

const getAll = async () => {
    return await SystemConfig.findAll();
};

const getOne = async () => {
    return await SystemConfig.findOne({
        where:{
            status:true
        }
    });
};

const create = async(data) => {
    return await SystemConfig.create(data);
}

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

const update = async (id,data) => {
    return await SystemConfig.update(data, {
        where : {
            id : id
        }
    })
}

exports.systemConfigService = {
  getAll,
  getInterest,
  getFixedMoney,
  getTransactionFee,
  getOne,
  create,
  update,
};
