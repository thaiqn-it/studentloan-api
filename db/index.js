const { Sequelize } = require('sequelize');

const { DB_USERNAME } = require('../constants/index')
const { DB_PASSWORD } = require('../constants/index')
const { DB_NAME } = require('../constants/index')
const { DB_HOST } = require('../constants/index')
const { DB_DIALECT } = require('../constants/index')

const sequelize = new Sequelize(DB_NAME, DB_USERNAME , DB_PASSWORD , {
    host: DB_HOST,
    dialect: DB_DIALECT,
    logging : false,
});

const dbConnection = sequelize.authenticate()

module.exports = dbConnection ;