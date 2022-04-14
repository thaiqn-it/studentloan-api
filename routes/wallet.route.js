const express = require("express");
const { walletController } = require("../controllers/wallet.controller");
const {studentAuth} = require("../middlewares/jwt_auth")
const {
    userAuth,
  } = require("../middlewares/jwt_auth");

const router = express.Router();

router.get("/",userAuth, walletController.getByUserId);

router.post("/", walletController.create);

router.post("/repayment", studentAuth, walletController.repayment)

router.delete("/", walletController.deleteById);

router.put("/:id", walletController.updateMoneyById);

module.exports = { walletRouter : router };
