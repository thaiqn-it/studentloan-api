const express = require("express");
const {
  transactionController,
} = require("../controllers/transaction.controller");

const router = express.Router();

router.get("/:id", transactionController.getTransaction);

router.post("/", transactionController.createTransaction);

router.delete("/", transactionController.deleteTransaction);

router.put("/:id", transactionController.updateTransaction);

module.exports = { transactionRouter: router };
