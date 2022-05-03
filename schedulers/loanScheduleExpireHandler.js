const { LOAN_SCHEDULE_STATUS, NOTIFICATION_TYPE, NOTIFICATION_STATUS } = require('../models/enum')
const { loanScheduleService } = require('../services/loanSchedule.service')
const userService = require('../services/user.service')
const firebaseService = require('../services/firebase.service')
const notificationService = require('../services/notification.service')

module.exports = async () => {
    const schedules = await loanScheduleService.getAllExpired()
    if (schedules === null || schedules.length === 0) return
    else {
        JSON.parse(JSON.stringify(schedules)).forEach(async item => {
            const penaltyMoney = item.Loan.penaltyFee * parseInt(item.money) 
            loanScheduleService.updateById(item.id, {
                penaltyMoney,
                status : LOAN_SCHEDULE_STATUS.INCOMPLETE
            })
            
            notificationService.create({
                userId : item.Loan.Student.User.id,
                redirectUrl : `https://studentloanfpt.ddns.net/trang-chu/ho-so/xem/${item.Loan.id}`,
                description : "Bạn đã không hoàn thành khoản thanh toán vay đúng hạn. Khoản vay sẽ được áp dụng phí phạt như trong điểu khoản.",
                isRead : false,
                type : NOTIFICATION_TYPE.LOAN,
                status : NOTIFICATION_STATUS.ACTIVE
            })
            item.Loan.Investments.forEach(async item => {
                const { pushToken } = await userService.getPushTokenByUserId(item.Investor.User.id)
                if (pushToken) {
                    firebaseService.pushNotificationService(
                        `${pushToken}`,
                        {
                            "notification" : {
                                "body" : "Sinh viên đã không trả đúng hạn cho bạn",
                                "title": "Thông báo",
                                "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23"
                            },
                            "data" : {
                                "experienceId": "@thainq2k/student-loan-app-client",
                                "scopeKey": "@thainq2k/student-loan-app-client",
                                "title": "Thông báo",
                                "message": "Khoản thanh toán vay bị trễ hạn",
                                "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23"
                           }
                        })
                }
                notificationService.create({
                    userId : item.Investor.User.id,
                    redirectUrl : `myapp://investmentDetail/${item.id}`,
                    description : "Khoản thanh toán vay bị trễ hạn",
                    isRead : false,
                    type : NOTIFICATION_TYPE.LOAN,
                    status : NOTIFICATION_STATUS.ACTIVE
                })
            })    
            const result = await loanScheduleService.countIncompleted(item.loanId)
            if(result >= 4) {
                const admin = await userService.getListAdmin()
                JSON.parse(JSON.stringify(admin)).forEach(item => {
                    notificationService.create({
                        userId : item.id,
                        redirectUrl : `myapp://investmentDetail/${item.id}`,
                        description : "Sinh viên không thanh toán kỳ hạn nhiều hơn 3 lần.",
                        isRead : false,
                        type : NOTIFICATION_TYPE.LOAN,
                        status : NOTIFICATION_STATUS.ACTIVE
                    })
                })
                
            }       
        })
    }

    
}