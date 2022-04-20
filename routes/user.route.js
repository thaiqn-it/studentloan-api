const express = require("express");
const userController = require("../controllers/user.controller");
const {
  userAuth,
  studentAuth,
  investorAuth,
  adminAuth,
} = require("../middlewares/jwt_auth");

const router = express.Router();

router.get("/", userController.getAll);

router.post("/", userController.creatUser);

router.post("/me/wallet", userAuth, userController.getWalletInfo);

router.post(
  "/me/transactions",
  userAuth,
  userController.getTransactionsByAccountId
);

router.post("/forgot-password", userController.forgotPassword);

router.post("/count", userController.count);

router.post("/registerByFb", userController.registerByFb);

router.post("/checkEmail", userController.checkEmail);

router.post("/registerByGog", userController.registerByGoogle);

router.post("/sendOTP", userController.sendOTP);

router.post("/verifyOTP", userController.verifyOTP);

router.post("/login", userController.login);

router.post("/loginByFb", userController.loginByFb);

router.post("/loginByGoogle", userController.loginByGoogle);

router.post("/verifyPassword",userAuth, userController.verifyPassword);

router.get("/student/me", studentAuth, userController.getProfile);

router.get("/investor/me", investorAuth, userController.getProfile);

router.get("/admin/me", adminAuth, userController.getProfile);

router.put("/", userAuth, userController.updateById);

router.put("/admin",adminAuth, userController.updateByAdmin);

router.put("/change-password",userAuth, userController.changePassword);

router.put("/reset-password", userController.resetPassword);

router.delete("/", userController.deleteUser);

module.exports = { userRoute: router };
