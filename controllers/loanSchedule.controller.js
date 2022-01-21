const { loanScheduleService } = require("../services/loanSchedule.service");
const { loanService } = require("../services/loan.service");
const { INTERNAL_SERVER_ERROR, NOT_FOUND,BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult, body } = require("express-validator");
const moment = require('moment');
  
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

        const timeStudy = Math.floor(moment(loan.expectedGraduationDay).diff(moment(loan.loanStartAt),'months',true))
        
        for (let i = 0; i < timeStudy ; i++) {
            const startAt = moment(new Date()).add(1 * i,'month');
            const endAt = moment(new Date()).add(1 * ( i + 1 ),'month');
            const paidAtStudying = {
                money : '100000',
                startAt : startAt,
                endAt : endAt,
                type : 'paidStudying',
                status : true,
                loanId : id
            }
            scheduleData.push(paidAtStudying)
        }

        const totalMoneyAtStudying = timeStudy * 100000;
        const leftMoney = parseFloat(loan.totalMoney)  - totalMoneyAtStudying;

        // const timePaidGraduted = Math.ceil(moment(loan.loanEndAt).diff(moment(new Date()).add(1 * timeStudy,'month'),'months', true))
        const moneyPaidGraduted = Math.round(leftMoney / loan.duration)
       
        for (let i = 0; i < loan.duration ; i++) {
            const startAt = moment(new Date(loan.expectedGraduationDay)).add(1 * i,'month');
            const endAt = moment(new Date(loan.expectedGraduationDay)).add(1 * (i + 1),'month');
            const paidAtStudying = {
                money : moneyPaidGraduted,
                startAt : startAt,
                endAt : endAt,
                type : 'paidGraduted',
                status : true,
                loanId : id,
            }

            scheduleData.push(paidAtStudying)
        }

        console.log(scheduleData);
        // const loanSchedule = await loanScheduleService.create(scheduleData);

        return res.json({
			// loanSchedule
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
};