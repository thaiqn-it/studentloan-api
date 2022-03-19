const express = require("express");
const { accountController } = require("../controllers/account.controller");
const {
    userAuth,
  } = require("../middlewares/jwt_auth");

const router = express.Router();

router.get("/",userAuth, accountController.getByUserId);

router.post("/", accountController.createAccount);

router.delete("/", accountController.deleteAccount);

router.put("/:id", accountController.updateByAccountId);

module.exports = { accountRouter: router };
