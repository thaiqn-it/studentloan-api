const sequelize = require('./index');

const { Wallet } = require('../models/wallet.model')
const { Major } = require('../models/major.model')
const { School } = require('../models/school.model')
const { SchoolMajor } = require('../models/schoolmajor.model')

const dbConnection = sequelize.sync({force : true})

module.exports = dbConnection