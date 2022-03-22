const express = require("express");
const { loanScheduleController } = require("../controllers/loanSchedule.controller");
const { body } = require("express-validator");
const { LOAN_SCHEDULE_STATUS, LOAN_SCHEDULE_TYPE } = require('../models/enum/index')

const router = express.Router();

router.get("/",loanScheduleController.findAll);

router.get("/:id", loanScheduleController.findById);

router.post("/:id",loanScheduleController.create);

router.put("/:id" , loanScheduleController.updateById)

module.exports = { loanScheduleRouter : router };