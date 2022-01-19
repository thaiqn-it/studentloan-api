const express = require("express");

const router = express.Router();
const stripeController = require("../controllers/stripe.controller");

router.get("/:accountId", stripeController.getAccountBalance);
router.post("/", stripeController.createAccount);
router.post("/transfer", stripeController.transfer);
module.exports = { stripeRoute: router };
