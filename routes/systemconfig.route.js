const express = require("express");
const { systemConfigController } = require("../controllers/systemconfig.controller");

const router = express.Router();

router.get("/getOne",systemConfigController.getOne);
router.get("/",systemConfigController.findAll);
router.get("/interest", systemConfigController.findInterest);
router.get("/transaction-fee", systemConfigController.findTransactionFee);
router.get("/fixed-money", systemConfigController.findFixedMoney);

router.post("/",systemConfigController.create);
router.put("/:id",systemConfigController.update);

module.exports = { systemConfigRouter : router };