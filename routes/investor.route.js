const express = require("express");
const investorController = require("../controllers/investor.controller");

const router = express.Router();

router.post("/", investorController.createInvestor);

router.get("/", investorController.getAllInvestors);

router.get("/:id", investorController.getInvestor);

router.get("/userId/:id", investorController.getInvestorById);

router.put("/:id", investorController.updateInvestor);

router.delete("/:id", investorController.deleteInvestor);

module.exports = { investorRoute: router };
