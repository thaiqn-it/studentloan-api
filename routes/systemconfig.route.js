const express = require("express");
const { systemConfigController } = require("../controllers/systemconfig.controller");

const router = express.Router();

router.get("/",systemConfigController.findAll);

router.get("/interest", systemConfigController.findInterest);
router.get("/transaction-fee", systemConfigController.findTransactionFee);
router.get("/fixed-money", systemConfigController.findFixedMoney);

module.exports = { systemConfigRouter : router };