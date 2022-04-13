const express = require("express");
const { loanHistoryController } = require("../controllers/loanHistory.controller");

const router = express.Router();

router.post("/",loanHistoryController.create);

router.put("/:id" , loanHistoryController.updateById)

router.get("/loan/:id" , loanHistoryController.getOneByLoanId)

module.exports = { loanHistoryRouter : router };