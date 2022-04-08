module.exports = {
    checkLoanExpired : {
        frequency : "* * * */10 * *",
        handler : "schedulers/loanExpiredHandler"
    },
    checkLoanScheduleExpireHandler : {
        frequency : "*/2 * * * * *",
        handler : "schedulers/loanScheduleExpireHandler"
    }
}