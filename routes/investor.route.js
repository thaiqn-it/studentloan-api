const express = require("express");
const investorController = require("../controllers/investor.controller");
const { investorAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.post("/", investorController.createInvestor);

router.get("/", investorController.getAllInvestors);

router.get("/:id", investorController.getInvestor);

router.get("/userId/:id", investorController.getInvestorById);

router.put("/", investorAuth ,investorController.updateInvestor);

router.delete("/:id", investorController.deleteInvestor);

module.exports = { investorRoute: router };
