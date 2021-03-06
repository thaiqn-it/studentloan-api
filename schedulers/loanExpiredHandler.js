const { loanService } = require('../services/loan.service')
const investmentService = require('../services/invesment.service')
const walletService = require('../services/wallet.service')
const transactionService = require('../services/transaction.service')
const { loanScheduleService } = require('../services/loanSchedule.service')
const { LOAN_STATUS, INVESTMENT_STATUS, WALLET_TYPE, TRANSACTION_STATUS, LOAN_SCHEDULE_TYPE, LOAN_SCHEDULE_STATUS, CONTRACT_STATUS, NOTIFICATION_TYPE, NOTIFICATION_STATUS } = require('../models/enum/index')
const FCM = require('fcm-node');
const serverKey = 'AAAAsTkfFbA:APA91bF2cc2Af_4o-yc8c7g2rnNMjYg5AQMnSGTPvL-j-Uoslj6D71V1Z-Ev9WAo12n8QC5mROmc1l2VkiKPjY7LTa6ZrRDP9phcp5kvFJPB1ZYXOggV8mnKHn0Nc-BS2lAsHZXrEmT8';
const fcm = new FCM(serverKey);
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
        const moneyPaidInGraduation = loan.expectedGraduationTime * parseFloat(loan.fixedMoney) 
        if (parseFloat(loan.totalMoney) - moneyPaidInGraduation > parseFloat(loan.totalMoney) / 2) {
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
    
            const leftMoney = (parseFloat(loan.totalMoney) + (parseFloat(loan.totalMoney) * loan.duration * loan.interest)) - loan.expectedGraduationTime * parseInt(loan.fixedMoney);
    
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
        } else {
            const paidMoney = parseFloat(loan.totalMoney) / loan.duration
            for (let i = 0; i < loan.expectedGraduationTime; i++) {
                const startAt = moment(new Date()).add(i,'month');
                const endAt = moment(new Date()).add(i + 1,'month');
                
                const paidAtStudying = {
                    money : paidMoney,
                    startAt : startAt,
                    endAt : endAt,
                    type : LOAN_SCHEDULE_TYPE.STP,
                    status : LOAN_SCHEDULE_STATUS.ONGOING,
                    loanId,
                    penaltyMoney : 0
                }
    
                scheduleData.push(paidAtStudying)
            } 

            const expectedGraduationDay = moment().add(loan.expectedGraduationTime, 'month')

            for (let i = 0; i < loan.duration - loan.expectedGraduationTime; i++) {
                const startAt = moment(new Date(expectedGraduationDay)).add(i,'month');
                const endAt = moment(new Date(expectedGraduationDay)).add(i + 1,'month');
                
                const paidAtStudying = {
                    money : paidMoney,
                    startAt : startAt,
                    endAt : endAt,
                    type : LOAN_SCHEDULE_TYPE.GP,
                    status : LOAN_SCHEDULE_STATUS.ONGOING,
                    loanId,
                    penaltyMoney : 0
                }
    
                scheduleData.push(paidAtStudying)
            }
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
                    description : "Kho???n vay c???a b???n ???? k??u g???i th???t b???i.",
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
                                    "body" : "Kho???n ?????u t?? c???a b???n ???? g??p v???n th???t b???i.",
                                    "title": "Th??ng b??o",
                                    "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23",
                                    "image" : "https://res.cloudinary.com/larrytran/image/upload/v1651638169/image/logo_duwoyg.png"
                                },
                                "data" : {
                                    "experienceId": "@thainq2k/student-loan-app-client",
                                    "scopeKey": "@thainq2k/student-loan-app-client",
                                    "title": "Th??ng b??o",
                                    "message": "Kho???n ?????u t?? c???a b???n ???? g??p v???n th???t b???i.",
                                    "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23"
                            }
                            })
                    }
                    
                    notificationService.create({
                        userId : investment.Investor.User.id,
                        redirectUrl : `myapp://investmentDetail/${investment.id}`,
                        description : "Kho???n ?????u t?? c???a b???n ???? g??p v???n th???t b???i.",
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
                                    description : `Chuy???n ti???n ?????n ${item.Student.User.firstName} ${item.Student.User.lastName}`,
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
                                                    description : `Nh???n ti???n t??? ${investment.Investor.User.firstName} ${investment.Investor.User.lastName}`,
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
                                    const mili = (moment().millisecond() < 10 ? '00' : moment().millisecond() < 100 ? '0' : '') + moment().millisecond().toString()
                                    const second = (moment().second() < 10 ? '0' : '') + moment().second().toString()
            
                                    const contractCode = randomCha + second + mili

                                    const data = {
                                        contractCode,
                                        total : investment.total,
                                        loanStartAt : moment().local(),
                                        loanEndAt : moment().local().add(item.duration,'M'),
                                        duration : item.duration,
                                        interest : item.interest,
                                        penaltyFee : item.penaltyFee
                                    }

                                    const borrower = { 
                                        headers: [`B??n vay: ${item.Student.User.firstName + " " + item.Student.User.lastName}`,""],
                                        rows: [
                                            [`Ng??y sinh: ${moment(item.Student.User.birthDate).format("DD/MM/YYYY")}`,`?????a ch???: ${item.Student.User.address}`],
                                            [`S??? CMND: ${item.Student.Information.citizenId}`,`C???p t???i : ${item.Student.Information.citizenCardCreatedPlace}     Ng??y: ${moment(item.Student.Information.citizenCardCreatedDate).format("DD/MM/YYYY")}`],
                                            [`Email: ${item.Student.User.email}`,`S??? ??T: ${item.Student.User.phoneNumber}`],
                                            // [`Tr?????ng: ?????i h???c FPT`,`MSSV : SE141062`],
                                            // [`Ng?????i b???o h???: Nguy???n Qu???c Th??i Th??i th??i`,`S??? CMND: 357237273`],
                                        ],
                                    }
                                    
                                    const lenders = { 
                                        headers: [`B??n cho vay: ${investment.Investor.User.firstName + " " + investment.Investor.User.lastName}`,""],
                                        rows: [
                                            [`Ng??y sinh: ${moment(investment.Investor.User.birthDate).format("DD/MM/YYYY")}`,`?????a ch???: ${investment.Investor.User.address}`],
                                            [`S??? CMND: ${investment.Investor.Information.citizenId}`, `C???p t???i : ${investment.Investor.Information.citizenCardCreatedPlace}     Ng??y: ${moment(investment.Investor.Information.citizenCardCreatedDate).format("DD/MM/YYYY")}`],
                                            [`Email: ${investment.Investor.User.email}`, `S??? ??i???n tho???i: ${investment.Investor.User.phoneNumber}`],
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
                                                    "body" : "Kho???n ?????u t?? c???a b???n ???? ???????c g??p v???n th??nh c??ng.",
                                                    "title": "Th??ng b??o",
                                                    "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23",
                                                    "image" : "https://res.cloudinary.com/larrytran/image/upload/v1651638169/image/logo_duwoyg.png"
                                                },
                                                "data" : {
                                                    "experienceId": "@thainq2k/student-loan-app-client",
                                                    "scopeKey": "@thainq2k/student-loan-app-client",
                                                    "title": "Th??ng b??o",
                                                    "message": "Kho???n ?????u t?? c???a b???n ???? ???????c g??p v???n th??nh c??ng.",
                                                    "link": "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23"
                                            }
                                            })
                                    }
                                    
                                    notificationService.create({
                                        userId : investment.Investor.User.id,
                                        redirectUrl : `myapp://investmentDetail/${investment.id}`,
                                        description : "Kho???n ?????u t?? c???a b???n ???? ???????c g??p v???n th??nh c??ng.",
                                        isRead : false,
                                        type : NOTIFICATION_TYPE.LOAN,
                                        status : NOTIFICATION_STATUS.ACTIVE
                                    })
                                })                           
                            })
                            notificationService.create({
                                userId : item.Student.User.id,
                                redirectUrl : `https://studentloanfpt.ddns.net/trang-chu/ho-so/xem/${item.id}`,
                                description : "Kho???n vay c???a b???n ???? ???????c k??u g???i th??nh c??ng.",
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