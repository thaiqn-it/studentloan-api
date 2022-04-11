const notificationService = require("../services/notification.service");
const { INTERNAL_SERVER_ERROR, NOT_FOUND,BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { mapErrorArrayExpressValidator } = require("../utils");
const { validationResult } = require("express-validator");
  
const create = async (req, res, next) => {
    const data = req.body;
    try {
        const notification = await notificationService.create(data);
        if (notification === null) throw new Error();
		return res.json({
            notification
		});
    } catch (error) {
        return res.status(BAD_REQUEST).json(restError.BAD_REQUEST.default());
    }
};

const getAllByUserId = async (req, res, next) => {
    const user = req.user;
    try {
        const notifications = await notificationService.getAllByUserId(user.id);
        const countNotRead = await notificationService.countIsNotRead(user.id);
        if (notifications === null) throw new Error();
		return res.json({
            countNotRead,
            notifications
		});
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

const updateById = async (req, res, next) => {
    const { id } = req.params
    const data = req.body;
    try {
        const result = await notificationService.updateById(id,data);
        if (result === null) throw new Error();
        const notification = result[1]
		return res.json({
            notification
		});
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json(restError.INTERNAL_SERVER_ERROR.default());
    }
};

const getOneById = async (req, res, next) => {
    const { id } = req.params
    try {
        const notification = await notificationService.getOneById(id);
        if (notification === null) throw new Error();
		return res.json({
            notification
		});
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR).json(restError.INTERNAL_SERVER_ERROR.default());
    }
};

const getTop5TodayByUserId = async (req, res, next) => {
    const user = req.user;
    const data = req.body
    try {
        const notifications = await notificationService.getTop5TodayByUserId(user.id,data);
        if (notifications === null) throw new Error();
		return res.json(notifications);
    } catch (error) {
        return res.status(NOT_FOUND).json(restError.NOT_FOUND.default());
    }
};

exports.notificationController = { 
    create,
    getAllByUserId,
    updateById,
    getOneById,
    getTop5TodayByUserId
};