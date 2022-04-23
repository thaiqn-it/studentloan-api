const { loanScheduleService } = require("../services/loanSchedule.service");
const { loanService } = require("../services/loan.service");
const { INTERNAL_SERVER_ERROR, NOT_FOUND,BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult, body } = require("express-validator");
const moment = require('moment');
const { LOAN_SCHEDULE_STATUS, LOAN_SCHEDULE_TYPE } = require("../models/enum")
  
const findAll = async (req, res, next) => {
    try {
        const loanSchedules = await loanScheduleService.findAll();
        return res.json(loanSchedules);
    } catch (error) {
        return res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};


const findAllByLoanId = async (req, res, next) => {
    try {
        const {id} = req.params
        const loanSchedules = await loanScheduleService.findAllByLoanId(id);
        return res.json(loanSchedules);
    } catch (error) {
        console.log(error)
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};

const findAllByLoanIdOption = async (req, res, next) => {
    try {
        const {id, optionNot} = req.params
        const loanSchedules = await loanScheduleService.findAllByLoanIdOption(id, optionNot);
        return res.json(loanSchedules);
    } catch (error) {
        console.log(error)
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};

const findById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const loanSchedule = await loanScheduleService.findById(id);
        if (loanSchedule === null) throw new Error();
		return res.json({
			loanSchedule,
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

const create = async (req, res, next) => {
    const { id } = req.params;
    var scheduleData = [];
    try {     
        const loan = await loanService.findById(id)
        for (let i = 0; i < loan.expectedGraduationTime ; i++) {
            const startAt = moment(new Date()).add(i,'month');
            const endAt = moment(new Date()).add(i + 1,'month');
            const paidAtStudying = {
                money : loan.fixedMoney,
                startAt : startAt,
                endAt : endAt,
                type : LOAN_SCHEDULE_TYPE.STP,
                status : LOAN_SCHEDULE_STATUS.ONGOING,
                loanId : id
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
                loanId : id,
            }

            scheduleData.push(paidAtStudying)
        }
        const loanSchedule = await loanScheduleService.create(scheduleData);
        return res.json({
			loanSchedule
		});
    } catch (error) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(restError.INTERNAL_SERVER_ERROR.default);
    }
};

const updateById = async (req,res,next) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const loanSchedule = await loanScheduleService.updateById(id, data)
        if (loanSchedule === null) throw new Error();
		return res.json({
			loanSchedule,
		});
    } catch (error) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(restError.INTERNAL_SERVER_ERROR.default());
    }
}

exports.loanScheduleController = { 
    findAll,
    findById,
    create,
    updateById,
    findAllByLoanId,
    findAllByLoanIdOption,
};