const express = require("express");
const userController = require("../controllers/user.controller");
const {
  userAuth,
  studentAuth,
  investorAuth,
} = require("../middlewares/jwt_auth");
const { body } = require("express-validator");
const UserService = require("../services/user.service");
const { Error } = require("sequelize");

const router = express.Router();

router.post(
  "/",
  //   body("firstname").not().isEmpty().withMessage("Fistname shouldn't be empty"),
  //   body("lastname").not().isEmpty().withMessage("Fistname shouldn't be empty"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("This is not a valid email")
    .notEmpty()
    .withMessage("Email must not leave empty")
    .custom(async (email) => {
      if ((await UserService.getOne({ email })) != null) {
        throw new Error("This email is used");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character"),

  body("confirmPassword").custom((confirmPassword, { req }) => {
    const { password } = req.body;
    console.log(req.body);
    if (password != confirmPassword) {
      throw new Error("Confirm password is wrong");
    }
    return true;
  }),

  userController.creatUser
);

router.post("/registerByFb", userController.registerByFb);

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
