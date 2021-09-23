const express = require("express");
const userController = require("../controllers/user.controller");
const { userAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.post("/student", userController.creatUser);

router.post("/investor", userController.creatUser);

router.post("/login", userController.login);

router.get("/me", userAuth, userController.getProfile);

router.put("/", userAuth, userController.updateUser);

router.delete("/", userController.deleteUser);

module.exports = { userRoute: router };
