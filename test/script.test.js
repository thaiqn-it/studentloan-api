const { LOAN_STATUS, LOAN_SCHEDULE_TYPE, LOAN_SCHEDULE_STATUS, INVESTMENT_STATUS } = require("../models/enum");
const { loanService } = require("../services/loan.service");
const { loanHistoryService } = require("../services/loanHistory.service");
const moment = require('moment');  
const { loanScheduleService } = require("../services/loanSchedule.service");
const { loanMediaService } = require("../services/loanMedia.service");
const InvestmentService = require("../services/invesment.service");

const test = async (req, res, next) => {
    const loan = await loanService.create({
        totalMoney : 10000000,
        interest : 0.01,
        description : 'Tình hình dịch bệnh phức tạp ở Việt Nam hiện nay khiến cho kinh tế nhiều gia đình khó khăn và gia đình em cũng không ngoại lệ. Do đó em mong muốn kêu gọi sự đầu tư từ những nhà hảo tâm cho em xin được vay mượn số tiền 70 triệu đồng cho khoản học phí kỳ 8. Em xin vô cùng biết ơn và hứa sẽ hoàn thành tốt việc học và thanh toán khoản nợ trong thời gian sớm nhất.',
        duration : 12,
        loanStartAt : '2022-04-15',
        loanEndAt : "2023-04-15",
        postCreatedAt : '2022-03-15',
        postExpireAt : '2022-04-15',
        studentId : '0f5bf97b-7365-43bc-8c9e-d28c32cb7557',
        title : "Khoảng vay cho học phí kỳ 5",
        expectedGraduationTime : 6,
        expectedMoney : 100000,
        fixedMoney : 200000,
        penaltyFee : 0.05
    })


    await loanHistoryService.updateByLoanId(loan.id, {
        type : LOAN_STATUS.ONGOING
    })

    await loanMediaService.createLoanMedia({
        loanId : loan.id,
        description : "Giấy báo học phí",
        imageUrl : "https://res.cloudinary.com/larrytran/image/upload/v1649607121/file/scan0244_v1fnpw.jpg",
        type : 'DEMANDNOTE',
        status : "ACTIVE"
    })

    await loanMediaService.createLoanMedia({
        loanId : loan.id,
        description : "Giấy báo học phí",
        imageUrl : "https://res.cloudinary.com/larrytran/image/upload/v1649607121/file/scan0244_v1fnpw.jpg",
        type : 'STUDENTCERT',
        status : "ACTIVE"
    })

    await loanMediaService.createLoanMedia({
        loanId : loan.id,
        description : "Giấy báo học phí",
        imageUrl : "https://res.cloudinary.com/larrytran/image/upload/v1649607121/file/scan0244_v1fnpw.jpg",
        type : 'TRANSCRIPT',
        status : "ACTIVE"
    })

    await InvestmentService.createOne({
        investorId : '9c817f7d-b06d-42a7-b878-8eb72499f8e9',
        status : INVESTMENT_STATUS.INVESTED,
        total : 1000000,
        loanId : loan.id,
        percent : 1
    })

    var scheduleData = [];
    for (let i = 0; i < loan.expectedGraduationTime ; i++) {
        const startAt = moment(new Date()).add(i - 4,'month').add(1,'minutes');
        const endAt = moment(new Date()).add(i - 3,'month').add(1,'minutes');
        const paidAtStudying = {
            money : loan.fixedMoney,
            startAt : startAt,
            endAt : endAt,
            type : LOAN_SCHEDULE_TYPE.STP,
            status : LOAN_SCHEDULE_STATUS.ONGOING,
            loanId : loan.id,
            penaltyMoney : 0
        }
        scheduleData.push(paidAtStudying)
    }

    const leftMoney = (parseFloat(loan.totalMoney) + (parseFloat(loan.totalMoney) * loan.duration * loan.interest)) - loan.expectedGraduationTime * parseInt(loan.fixedMoney);
    
    const moneyPaidGraduted = Math.round(leftMoney / (loan.duration - loan.expectedGraduationTime))

    const expectedGraduationDay = moment().add(loan.expectedGraduationTime, 'month')

    for (let i = 0; i < loan.duration - loan.expectedGraduationTime ; i++) {
        const startAt = moment(new Date(expectedGraduationDay)).add(i - 4,'month').add(1,'minutes');
        const endAt = moment(new Date(expectedGraduationDay)).add(i - 3,'month').add(1,'minutes');
        const paidAtStudying = {
            money : moneyPaidGraduted,
            startAt : startAt,
            endAt : endAt,
            type : LOAN_SCHEDULE_TYPE.GP,
            status : LOAN_SCHEDULE_STATUS.ONGOING,
            loanId : loan.id,
            penaltyMoney : 0
        }

        scheduleData.push(paidAtStudying)
    }

    await loanScheduleService.create(scheduleData);

    res.json({ status : true })
};


exports.test = {
    test
};  