const express = require("express");

const router = express.Router();
const { paypalController } = require("../controllers/paypal.controller");

router.post("/top-up", paypalController.topup);
router.post("/transfer", paypalController.transfer);
router.get("/success", paypalController.success);
router.get("/cancel", paypalController.cancel);

module.exports = { paypalRoute : router };
