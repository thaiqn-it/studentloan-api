const express = require("express");
const investorController = require("../controllers/investor.controller");

const router = express.Router();

router.post("/", investorController.createInvestor);

router.get("/", investorController.getAllInvestor);

router.put("/:id", investorController.updateInvestor);

router.delete("/:id", investorController.deleteInvestor);

module.exports = { investorRouter: router };
