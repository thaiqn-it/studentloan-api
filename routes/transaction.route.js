const express = require("express");
const {
  transactionController,
} = require("../controllers/transaction.controller");

const router = express.Router();

router.get("/:id", transactionController.getTransaction);

router.get("/wallet/:id", transactionController.getByWalletId);

router.get("/", transactionController.getAllTransaction);

router.post("/", transactionController.createTransaction);

router.post("/count", transactionController.count);

router.delete("/", transactionController.deleteTransaction);

router.put("/:id", transactionController.updateTransaction);

module.exports = { transactionRouter: router };
