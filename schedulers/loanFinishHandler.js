const { LOAN_STATUS } = require("../models/enum")
const { loanService } = require("../services/loan.service")
const { loanHistoryService } = require("../services/loanHistory.service")

module.exports = async () => { 
    const loans = await loanService.getAll()
    JSON.parse(JSON.stringify(loans)).forEach(item => {
        loanService.getFinishLoan(item.id).then(res => {
            const loan = JSON.parse(JSON.stringify(res))
            if(loan?.LoanSchedules.length === 0) {
                loanHistoryService.updateByLoanId(item.id, {
                    isActive : false
                }).then(() => {
                    loanHistoryService.create({
                        loanId : item.id,
                        type : LOAN_STATUS.FINISH,
                        isActive : true
                    })
                })
            } else {
                return
            }
        })
        
    })
}