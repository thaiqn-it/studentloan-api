module.exports = {
    checkLoanExpired : {
        frequency : "*/10 * * * * *",
        handler : "schedulers/loanExpiredHandler"
    }
}