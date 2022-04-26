const express = require("express");
const { loanScheduleController } = require("../controllers/loanSchedule.controller");
const { userAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.get("/",loanScheduleController.findAll);

router.get("/loan/:id", userAuth ,loanScheduleController.findAllByLoanId);

router.get("/loan/:id/:optionNot",loanScheduleController.findAllByLoanIdOption);

router.get("/:id", loanScheduleController.findById);

router.post("/:id",loanScheduleController.create);

router.put("/:id" , loanScheduleController.updateById)

module.exports = { loanScheduleRouter : router };