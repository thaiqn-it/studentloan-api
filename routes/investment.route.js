const express = require("express");
const investmentController = require("../controllers/invesment.controller");

const router = express.Router();

router.post("/", investmentController.createInvestment);

router.get("/:id", investmentController.getAllInvestment);

// router.get("/:id", InvestmentController.getInvestment);

router.put("/:id", investmentController.updateInvestment);

router.delete("/:id", investmentController.deleteInvestment);

module.exports = { investmentRoute: router };
