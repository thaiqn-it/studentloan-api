const express = require("express");
const { loanScheduleController } = require("../controllers/loanSchedule.controller");
const { body } = require("express-validator");
const { LOAN_SCHEDULE_STATUS, LOAN_SCHEDULE_TYPE } = require('../models/enum/index')

const router = express.Router();

router.get("/",loanScheduleController.findAll);

router.get("/:id", loanScheduleController.findById);

router.post(
    "/",

    [
        body("money")
            .notEmpty()
            .withMessage("Money should not be empty"),
        body("interest")
            .notEmpty()
            .withMessage("Interest should not be empty"),
        body("description")
            .notEmpty()
            .trim()
            .withMessage("Description should not be empty"),
        body("loanStartAt")
            .notEmpty()
            .withMessage("Start day should not be empty")
            .bail()
            .isISO8601().toDate().withMessage("Start day wrong format"),
        body("loanEndAt")
            .notEmpty()
            .withMessage("End day should not be empty")
            .bail(),
        body("postExpireAt")
            .notEmpty()
            .withMessage("Expire at should not be empty")
            .bail(),
        body("expectedGraduationDay")
            .notEmpty()
            .withMessage("Expected graduation day should not be empty")
            .bail(),
        body("status")
            .notEmpty()
            .isIn(Object.values(LOAN_SCHEDULE_STATUS))
            .withMessage(`Status should be one of ${Object.values(LOAN_SCHEDULE_STATUS)}`)
    ], 
    loanScheduleController.create
);

router.put("/:id" , loanScheduleController.updateById)

module.exports = { loanScheduleRouter : router };