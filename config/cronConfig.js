module.exports = {
    checkLoanExpired : {
        frequency : "*/15 * * * * *",
        handler : "schedulers/loanExpiredHandler"
    }
}