const { loanService } = require('../services/loan.service')
const investmentService = require('../services/invesment.service')
const walletService = require('../services/wallet.service')
const transactionService = require('../services/transaction.service')
const { loanScheduleService } = require('../services/loanSchedule.service')
const { LOAN_STATUS, INVESTMENT_STATUS, WALLET_TYPE, WALLET_STATUS, TRANSACTION_STATUS, LOAN_SCHEDULE_TYPE, LOAN_SCHEDULE_STATUS, CONTRACT_STATUS } = require('../models/enum/index')
const FCM = require('fcm-node');
const serverKey = 'AAAAsTkfFbA:APA91bF2cc2Af_4o-yc8c7g2rnNMjYg5AQMnSGTPvL-j-Uoslj6D71V1Z-Ev9WAo12n8QC5mROmc1l2VkiKPjY7LTa6ZrRDP9phcp5kvFJPB1ZYXOggV8mnKHn0Nc-BS2lAsHZXrEmT8';
const fcm = new FCM(serverKey);
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { log } = require('console')
const moment = require('moment');  
const { createContract } = require('../utils/generateContract')
const { contractService } = require('../services/contract.service')

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
        
        for (let i = 0; i < loan.expectedGraduationTime ; i++) {
            const startAt = moment(new Date()).add(i,'month');
            const endAt = moment(new Date()).add(i + 1,'month');
            const paidAtStudying = {
                money : loan.fixedMoney,
                startAt : startAt,
                endAt : endAt,
                type : LOAN_SCHEDULE_TYPE.STP,
                status : LOAN_SCHEDULE_STATUS.ONGOING,
                loanId
            }
            scheduleData.push(paidAtStudying)
        }

        const leftMoney = parseFloat(loan.totalMoney) - loan.expectedGraduationTime * parseInt(loan.fixedMoney);

        const moneyPaidGraduted = Math.round(leftMoney / loan.duration)

        const expectedGraduationDay = moment().add(loan.expectedGraduationTime, 'month')
       
        for (let i = 0; i < loan.duration ; i++) {
            const startAt = moment(new Date(expectedGraduationDay)).add(i,'month');
            const endAt = moment(new Date(expectedGraduationDay)).add(i + 1,'month');
            const paidAtStudying = {
                money : moneyPaidGraduted,
                startAt : startAt,
                endAt : endAt,
                type : LOAN_SCHEDULE_TYPE.GP,
                status : LOAN_SCHEDULE_STATUS.ONGOING,
                loanId
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
                console.log('fail');
                // loanService.updateById(item.id, {
                //     status : LOAN_STATUS.FAIL
                // })
                // investmentService.updateByLoanId(item.id, {
                //     status : INVESTMENT_STATUS.FAIL
                // })

                // var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                //     to: 'f2JVrT5USTyqaKqinm6Q23:APA91bE8JxdCuD4xgCKutjX1XKYx8GcY7RFSCX4faZQqme-izgBsJhIsD2CbguNjIJMdOMFsqfny_jTzx31BfD522vm9SSAqJDVy9qCh8lNDQ4Z6gVKv2ggzZLAJ6mB2UUjAiWripWBw', 
                    
                //     notification: {
                //         title: 'Khoản đầu tư chưa thành công', 
                //         body: 'Khoản vay không đạt đủ điều kiện vay.' ,
                //         link: "myapp://detailPost/22874fd0-4ebf-48b2-a33a-43843d0fea23"
                //     },
                // };
                
                // fcm.send(message, function(err, response){
                //     if (err) {
                //         console.log("Something has gone wrong!");
                //     } else {
                //         console.log("Successfully sent with response: ", response);
                //     }
                // });

            } else if(parseInt(item.totalMoney) <= parseInt(item.AccumulatedMoney) || parseInt(item.expectedMoney) <= parseInt(item.AccumulatedMoney)) {
                console.log('success');
                try {
                    // item.Investments.forEach(investment => {
                    //     walletService.getWalletByUserId(investment.Investor.userId).then(res => {
                    //         walletService.updateMoneyById(res.id, -parseInt(investment.total)).then(() => {
                    //             transactionService.createTransactionService({
                    //                 money : parseInt(investment.total),
                    //                 type : WALLET_TYPE.TRANSFER,
                    //                 description : `Chuyển tiền đến ${item.Student.User.firstName} ${item.Student.User.lastName}`,
                    //                 status : TRANSACTION_STATUS.SUCCESS,
                    //                 transactionFee : 0,
                    //                 recipientId : item.Student.userId,
                    //                 recipientName : item.Student.User.firstName + ' ' + item.Student.User.lastName,
                    //                 senderId : investment.Investor.userId,
                    //                 senderName : investment.Investor.User.firstName + ' ' + investment.Investor.User.lastName,
                    //                 walletId : res.id
                    //             }).then((res) => {
                    //                 investmentService.updateOne(investment.id, {
                    //                     status : INVESTMENT_STATUS.INVESTED,
                    //                     transactionId : res.id
                    //                 }).then(() => {
                    //                     walletService.getWalletByUserId(item.Student.userId).then(res => {
                    //                         walletService.updateMoneyById(res.id, parseInt(investment.total)).then(() => {
                    //                             transactionService.createTransactionService({
                    //                                 money : parseInt(investment.total),
                    //                                 type : WALLET_TYPE.RECEIVE,
                    //                                 description : `Nhận tiền từ ${investment.Investor.User.firstName} ${investment.Investor.User.lastName}`,
                    //                                 status : TRANSACTION_STATUS.SUCCESS,
                    //                                 transactionFee : 0,
                    //                                 recipientId : item.Student.userId,
                    //                                 recipientName : item.Student.User.firstName + ' ' + item.Student.User.lastName,
                    //                                 senderId : investment.Investor.userId,
                    //                                 senderName : investment.Investor.User.firstName + ' ' + investment.Investor.User.lastName,
                    //                                 walletId : res.id
                    //                             })
                    //                         })
                    //                     })
                    //                 })                        
                    //             })
                    //         })
                    //     })
                    // })
                } catch (error) {
                    console.log(error);
                } finally {
                    console.log(item);
                    item.Investments.forEach(investment => {
                        const randomCha = randomCharater(3)
                        const mili = moment().millisecond().toString()
                        const second = (moment().second() < 10 ? '0' : '') + moment().second().toString()

                        const contractCode = randomCha + second + mili
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

                        // loanService.updateById(item.id, {
                        //     // status : LOAN_STATUS.ONGOING,
                        //     loanStartAt : moment().local(),
                        //     loanEndAt : moment().local().add(item.duration,'M')
                        // }).then(() => {        
                        //     createSchedule(item.id).then(() => {
                        //         createContract(borrower,lenders,contractCode).then(res => {
                        //             contractService.create({
                        //                 loanId : item.id,
                        //                 status : CONTRACT_STATUS.ACTIVE,
                        //                 contractUrl : res.secure_url
                        //             })
                        //         }).then(res => {
                        //             console.log(res);
                        //         })
                        //     })         
                        // })
                        
                    })
                   
                   
                }
            }
        })
    }
}