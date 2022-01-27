const express = require("express");
const userController = require("../controllers/user.controller");
const {
  userAuth,
  studentAuth,
  investorAuth,
} = require("../middlewares/jwt_auth");

const router = express.Router();

router.post("/", userController.creatUser);

router.post("/me/wallet", userAuth, userController.getWalletInfo);

router.post(
  "/me/transactions",
  userAuth,
  userController.getTransactionsByAccountId
);

router.post("/registerByFb", userController.registerByFb);

router.post("/checkEmail", userController.checkEmail);

router.post("/registerByGog", userController.registerByGoogle);

router.post("/sendOTP", userController.sendOTP);

router.post("/verifyOTP", userController.verifyOTP);

router.post("/login", userController.login);

router.post("/loginByFb", userController.loginByFb);

router.post("/loginByGoogle", userController.loginByGoogle);

router.get("/student/me", studentAuth, userController.getProfile);

router.get("/investor/me", investorAuth, userController.getProfile);

router.put("/", userAuth, userController.updateUser);

router.delete("/", userController.deleteUser);

module.exports = { userRoute: router };