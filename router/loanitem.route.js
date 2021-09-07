const express = require("express");
const loanitemController = require("../controller/loanitem.controller");

const router = express.Router();

router.get("/", loanitemController.findAllLoanItemService);

router.post("/", loanitemController.createLoanItemService);

router.post("/", loanitemController.updateLoanItemService);

module.exports = { loanRouter: router };