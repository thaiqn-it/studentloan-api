module.exports = {
    checkLoanExpired : {
        frequency : "*/2 * * * * *",
        handler : "schedulers/loanExpiredHandler"
    },
    checkLoanScheduleExpireHandler : {
        frequency : "*/10 * * * * *",
        handler : "schedulers/loanScheduleExpireHandler"
    }
}