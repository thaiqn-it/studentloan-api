const db = require("../models");
const { SYSTEM_CONFIG_TYPE } = require("../models/enum");
const SystemConfig = db.SystemConfig;

const getAll = async () => {
    return await SystemConfig.findAll();
};

const getByType = async (type) => {
    return await SystemConfig.findOne({
        where : {
            type
        }
    });
};

exports.systemConfigService = {
  getAll,
  getByType,
};
