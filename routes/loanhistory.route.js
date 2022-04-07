const express = require("express");
const { loanHistoryController } = require("../controllers/loanHistory.controller");

const router = express.Router();

router.post("/",loanHistoryController.create);

router.put("/:id" , loanHistoryController.updateById)

module.exports = { loanHistoryRouter : router };