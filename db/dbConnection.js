const { mssqlConnection } = require('../db')

const { LoanItem } = require('../model/loanitem.model')

const dbConnection = mssqlConnection.sync({force:true})

module.exports = dbConnection