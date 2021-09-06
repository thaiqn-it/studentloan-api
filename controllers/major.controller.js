const { majorService } = require('../services/major.service')
const {
    NOT_FOUND,
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
} = require("http-status");
const { restError } = require("../errors/rest");
const { body, validationResult } = require("express-validator");

const getAll = async (req,res,next) => {
    try {
        const majors = await majorService.getAll();
        return res.json({
            majors
        });
    } catch (err) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json(restError.INTERNAL_SERVER_ERROR.default());
    }
}

module.exports = {
    majorController : {
        getAll,

    }
}