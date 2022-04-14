module.exports = {
    checkLoanExpired : {
        frequency : "*/10 * * * * *",
        handler : "schedulers/loanExpiredHandler"
    },
    checkLoanScheduleExpireHandler : {
        frequency : "*/10 * * * * *",
        handler : "schedulers/loanScheduleExpireHandler"
    },
    checkLoanFinishHandler : {
        frequency : "*/1 * * * * *",
        handler : "schedulers/loanFinishHandler"
    }
}