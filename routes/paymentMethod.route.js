const express = require("express");
const {
  paymentMethodController,
} = require("../controllers/paymentMethod.controller");

const router = express.Router();

router.get("/:id", paymentMethodController.getPaymentMethod);

router.post("/", paymentMethodController.createPaymentMethod);

router.delete("/", paymentMethodController.deletePaymentMethod);

router.put("/:id", paymentMethodController.updatePaymentMethod);

module.exports = { paymentMethodRouter: router };
