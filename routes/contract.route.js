const express = require("express");
const { contractController } = require("../controllers/contract.controller");
const { investorAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.get("/investment/:id", contractController.findByInvestmentId);

router.get("/", investorAuth ,contractController.findAllByInvestorId);

module.exports = { contractRoute: router };
