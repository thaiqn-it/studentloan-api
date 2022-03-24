const express = require("express");
const { walletController } = require("../controllers/wallet.controller");
const {
    userAuth,
  } = require("../middlewares/jwt_auth");

const router = express.Router();

router.get("/",userAuth, walletController.getByUserId);

router.post("/", walletController.create);

router.delete("/", walletController.deleteById);

router.put("/:id", walletController.updateMoneyById);

module.exports = { walletRouter : router };
