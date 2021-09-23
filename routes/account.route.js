const express = require("express");
const { accountController } = require("../controllers/account.controller");

const router = express.Router();

router.get("/:id", accountController.getAccount);

router.post("/", accountController.createAccount);

router.delete("/", accountController.deleteAccount);

router.put("/:id", accountController.updateAccount);

module.exports = { accountRouter: router };
