const { loanService } = require('../services/loan.service')
const investmentService = require('../services/invesment.service')
const walletService = require('../services/wallet.service')
const transactionService = require('../services/transaction.service')
const { loanScheduleService } = require('../services/loanSchedule.service')
const { LOAN_STATUS, INVESTMENT_STATUS, WALLET_TYPE, WALLET_STATUS, TRANSACTION_STATUS, LOAN_SCHEDULE_TYPE, LOAN_SCHEDULE_STATUS, CONTRACT_STATUS, NOTIFICATION_TYPE, NOTIFICATION_STATUS } = require('../models/enum/index')
const FCM = require('fcm-node');
const serverKey = 'AAAAsTkfFbA:APA91bF2cc2Af_4o-yc8c7g2rnNMjYg5AQMnSGTPvL-j-Uoslj6D71V1Z-Ev9WAo12n8QC5mROmc1l2VkiKPjY7LTa6ZrRDP9phcp5kvFJPB1ZYXOggV8mnKHn0Nc-BS2lAsHZXrEmT8';
const fcm = new FCM(serverKey);
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { log } = require('console')
const moment = require('moment');  
const { createContract } = require('../utils/generateContract')
const { contractService } = require('../services/contract.service')
const { loanHistoryService } = require('../services/loanHistory.service')
const userService = require('../services/user.service')
const firebaseService = require('../services/firebase.service')
const notificationService = require('../services/notification.service')

const randomCharater = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const createSchedule = async (loanId) => {
    var scheduleData = [];
    try {     
        const loan = await loanService.findById(loanId)
        // const moneyPaidInGraduation = loan.expectedGraduationTime * parseFloat(loan.fixedMoney) 
        // if (parseFloat(loan.total) - moneyPaidInGraduation > 100000)
        
        for (let i = 0; i < loan.expectedGraduationTime ; i++) {
            const startAt = moment(new Date()).add(i,'month');
            const endAt = moment(new Date()).add(i + 1,'month');
            const paidAtStudying = {
                money : loan.fixedMoney,
                startAt : startAt,
                endAt : endAt,
                type : LOAN_SCHEDULE_TYPE.STP,
                status : LOAN_SCHEDULE_STATUS.ONGOING,
                loanId,
                penaltyMoney : 0
            }
            scheduleData.push(paidAtStudying)
        }

        const leftMoney = (parseFloat(loan.totalMoney)  + (parseFloat(loan.totalMoney) * loan.duration * loan.interest)) - loan.expectedGraduationTime * parseInt(loan.fixedMoney);

        const moneyPaidGraduted = Math.round(leftMoney / (loan.duration - loan.expectedGraduationTime))

        const expectedGraduationDay = moment().add(loan.expectedGraduationTime, 'month')
       
        for (let i = 0; i < loan.duration - loan.expectedGraduationTime ; i++) {
            const startAt = moment(new Date(expectedGraduationDay)).add(i,'month');
            const endAt = moment(new Date(expectedGraduationDay)).add(i + 1,'month');
            const paidAtStudying = {
                money : moneyPaidGraduted,
                startAt : startAt,
                endAt : endAt,
                type : LOAN_SCHEDULE_TYPE.GP,
                status : LOAN_SCHEDULE_STATUS.ONGOING,
                loanId,
                penaltyMoney : 0
            }

            scheduleData.push(paidAtStudying)
        }
        await loanScheduleService.create(scheduleData);
    } catch (error) {
        console.log(error);
    }
}

module.exports = async () => {
    const loan = await loanService.getMatchingLoan()
    if (loan === null || loan.length === 0) return
    else {
        JSON.parse(JSON.stringify(loan)).forEach(item => {
            if(parseInt(item.totalMoney) > parseInt(item.AccumulatedMoney) && parseInt(item.expectedMoney) > parseInt(item.AccumulatedMoney)) {
                loanHistoryService.updateByLoanId(item.id, {
                    isActive : false
                }).then(() => {
                    loanHistoryService.create({
                        loanId : item.id,
                        type : LOAN_STATUS.FAIL,
                        isActive : true
                    }) 
                })             
                investmentService.updateByLoanId(item.id, {
                    status : INVESTMENT_STATUS.FAIL
                })
                notificationService.create({
                    userId : item.Student.User.id,
                    redirectUrl : `https://studentloanfpt.ddns.net/trang-chu/ho-so/xem/${item.id}`,
                    description : "Khoản vay của bạn đã kêu gọi thất bại.",
                    isRead : false,
                    type : NOTIFICATION_TYPE.LOAN,
                    status : NOTIFICATION_STATUS.ACTIVE
                })
                item.Investments.forEach(async investment => {
                    const { pushToken } = await userService.getPushTokenByUserId(investment.Investor.User.id)
                    if (pushToken) {
                        firebaseService.pushNotificationService(
                            `${pushToken}`,
                            {
                                "notification" : {
                                    "body" : "Khoản đầu tư của bạn đã góp vốn thất bại.",
                                    "title": "Thông báo",
                                    "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23"
                                },
                                "data" : {
                                    "experienceId": "@thainq2k/student-loan-app-client",
                                    "scopeKey": "@thainq2k/student-loan-app-client",
                                    "title": "Thông báo",
                                    "message": "Khoản đầu tư của bạn đã góp vốn thất bại.",
                                    "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23"
                            }
                            })
                    }
                    
                    notificationService.create({
                        userId : investment.Investor.User.id,
                        redirectUrl : `myapp://investmentDetail/${investment.id}`,
                        description : "Khoản đầu tư của bạn đã góp vốn thất bại.",
                        isRead : false,
                        type : NOTIFICATION_TYPE.LOAN,
                        status : NOTIFICATION_STATUS.ACTIVE
                    })
                })
            } else if(parseInt(item.totalMoney) <= parseInt(item.AccumulatedMoney) || parseInt(item.expectedMoney) <= parseInt(item.AccumulatedMoney)) {
                try {
                    item.Investments.forEach(investment => {
                        const user = {
                            id : investment.Investor.User.id,
                            type : 'INVESTOR'
                        }
                        walletService.getWalletByUserId(user).then(res => {             
                            walletService.updateMoneyById(res.id, -parseInt(investment.total)).then(() => {
                                transactionService.createTransactionService({
                                    money : parseInt(investment.total),
                                    type : WALLET_TYPE.TRANSFER,
                                    description : `Chuyển tiền đến ${item.Student.User.firstName} ${item.Student.User.lastName}`,
                                    status : TRANSACTION_STATUS.SUCCESS,
                                    transactionFee : 0,
                                    recipientId : item.Student.User.id,
                                    recipientName : item.Student.User.firstName + ' ' + item.Student.User.lastName,
                                    senderId : investment.Investor.User.id,
                                    senderName : investment.Investor.User.firstName + ' ' + investment.Investor.User.lastName,
                                    walletId : res.id
                                }).then((res) => {
                                    investmentService.updateOne(investment.id, {
                                        status : INVESTMENT_STATUS.INVESTED,
                                        transactionId : res.id
                                    }).then(() => {
                                        const user = {
                                            id : item.Student.User.id,
                                            type : 'INVESTOR'
                                        }
                                        walletService.getWalletByUserId(user).then(res => {
                                            walletService.updateMoneyById(res.id, parseInt(investment.total)).then(() => {
                                                transactionService.createTransactionService({
                                                    money : parseInt(investment.total),
                                                    type : WALLET_TYPE.RECEIVE,
                                                    description : `Nhận tiền từ ${investment.Investor.User.firstName} ${investment.Investor.User.lastName}`,
                                                    status : TRANSACTION_STATUS.SUCCESS,
                                                    transactionFee : 0,
                                                    recipientId : item.Student.User.id,
                                                    recipientName : item.Student.User.firstName + ' ' + item.Student.User.lastName,
                                                    senderId : investment.Investor.User.id,
                                                    senderName : investment.Investor.User.firstName + ' ' + investment.Investor.User.lastName,
                                                    walletId : res.id
                                                })
                                            })
                                        })
                                    })                        
                                })
                            })
                        })
                    })
                } catch (error) {
                    console.log(error);
                } finally {
                    loanService.updateById(item.id, {
                        loanStartAt : moment().local(),
                        loanEndAt : moment().local().add(item.duration,'M')
                    }).then((res) => { 
                        loanHistoryService.updateByLoanId(res.id, {
                            isActive : false,
                        }).then(() => {     
                            loanHistoryService.create({
                                loanId : res.id,
                                type : LOAN_STATUS.ONGOING,
                                isActive : true
                            })                   
                            createSchedule(item.id).then(() => {
                                item.Investments.forEach(async investment => {
                                    const randomCha = randomCharater(3)
                                    const mili = moment().millisecond().toString()
                                    const second = (moment().second() < 10 ? '0' : '') + moment().second().toString()
            
                                    const contractCode = randomCha + second + mili

                                    const data = {
                                        contractCode,
                                        total : investment.total,
                                        loanStartAt : moment().local(),
                                        loanEndAt : moment().local().add(item.duration,'M'),
                                        duration : item.duration,
                                        interest : item.interest
                                    }

                                    const borrower = { 
                                        headers: [`Bên vay: ${item.Student.User.firstName + " " + item.Student.User.lastName}`,""],
                                        rows: [
                                            [`Ngày sinh: ${moment(item.Student.User.birthDate).format("DD/MM/YYYY")}`,`Địa chỉ: ${item.Student.User.address}`],
                                            [`Số CMND: ${item.Student.Information.citizenId}`,`Cấp tại : ${item.Student.Information.citizenCardCreatedPlace}     Ngày: ${moment(item.Student.Information.citizenCardCreatedDate).format("DD/MM/YYYY")}`],
                                            [`Email: ${item.Student.User.email}`,`Số ĐT: ${item.Student.User.phoneNumber}`],
                                            // [`Trường: Đại học FPT`,`MSSV : SE141062`],
                                            // [`Người bảo hộ: Nguyễn Quốc Thái Thái thái`,`Số CMND: 357237273`],
                                        ],
                                    }
                                    
                                    const lenders = { 
                                        headers: [`Bên cho vay: ${investment.Investor.User.firstName + " " + investment.Investor.User.lastName}`,""],
                                        rows: [
                                            [`Ngày sinh: ${moment(investment.Investor.User.birthDate).format("DD/MM/YYYY")}`,`Địa chỉ: ${investment.Investor.User.address}`],
                                            [`Số CMND: ${investment.Investor.Information.citizenId}`, `Cấp tại : ${investment.Investor.Information.citizenCardCreatedPlace}     Ngày: ${moment(investment.Investor.Information.citizenCardCreatedDate).format("DD/MM/YYYY")}`],
                                            [`Email: ${investment.Investor.User.email}`, `Số điện thoại: ${investment.Investor.User.phoneNumber}`],
                                        ],
                                    }    
                                    createContract(borrower,lenders,data).then(res => {
                                        contractService.create({
                                            investmentId : investment.id,
                                            status : CONTRACT_STATUS.ACTIVE,
                                            contractUrl : res.secure_url,
                                            contractCode
                                        })
                                    })       
                                    
                                    const { pushToken } = await userService.getPushTokenByUserId(investment.Investor.User.id)
                                    if (pushToken) {
                                        firebaseService.pushNotificationService(
                                            `${pushToken}`,
                                            {
                                                "notification" : {
                                                    "body" : "Khoản đầu tư của bạn đã được góp vốn thành công.",
                                                    "title": "Thông báo",
                                                    "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23"
                                                },
                                                "data" : {
                                                    "experienceId": "@thainq2k/student-loan-app-client",
                                                    "scopeKey": "@thainq2k/student-loan-app-client",
                                                    "title": "Thông báo",
                                                    "message": "Khoản đầu tư của bạn đã được góp vốn thành công.",
                                                    "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23"
                                            }
                                            })
                                    }
                                    
                                    notificationService.create({
                                        userId : investment.Investor.User.id,
                                        redirectUrl : `myapp://investmentDetail/${investment.id}`,
                                        description : "Khoản đầu tư của bạn đã được góp vốn thành công.",
                                        isRead : false,
                                        type : NOTIFICATION_TYPE.LOAN,
                                        status : NOTIFICATION_STATUS.ACTIVE
                                    })
                                })                           
                            })
                            notificationService.create({
                                userId : item.Student.User.id,
                                redirectUrl : `https://studentloanfpt.ddns.net/trang-chu/ho-so/xem/${item.id}`,
                                description : "Khoản vay của bạn đã được kêu gọi thành công.",
                                isRead : false,
                                type : NOTIFICATION_TYPE.LOAN,
                                status : NOTIFICATION_STATUS.ACTIVE
                            })
                        })                     
                    })               
                }
            }
        })
    }
}