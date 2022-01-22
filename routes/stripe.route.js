const express = require("express");

const router = express.Router();
const stripeController = require("../controllers/stripe.controller");

router.get("/:accountId", stripeController.getAccountBalance);
router.post("/", stripeController.createAccount);
router.post("/transfer", stripeController.transfer);
router.post("/top-up", stripeController.topup);
router.post("/charge", stripeController.charge);
module.exports = { stripeRoute: router };
