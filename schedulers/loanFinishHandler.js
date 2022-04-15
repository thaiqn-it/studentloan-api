const { LOAN_STATUS } = require("../models/enum")
const { loanService } = require("../services/loan.service")
const { loanHistoryService } = require("../services/loanHistory.service")

module.exports = async () => { 
    const loans = await loanService.getFinishLoan()
    JSON.parse(JSON.stringify(loans)).forEach(item => {
        loanHistoryService.updateByLoanId(item.id, {
            isActive : false
        }).then(() => {
            loanHistoryService.create({
                loanId : item.id,
                type : LOAN_STATUS.FINISH,
                isActive : true
            })
        })
    })
}