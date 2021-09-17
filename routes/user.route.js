const express = require("express");
const userControler = require("../controllers/user.controler");
const { userAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.post("/student", userControler.creatUser);

router.post("/investor", userControler.creatUser);

router.post("/login", userControler.login);

router.get("/me", userAuth, userControler.getProfile);

module.exports = { userRoute: router };
