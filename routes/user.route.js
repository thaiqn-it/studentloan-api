const express = require("express");
const userControler = require("../controllers/user.controler");
const { userAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.post("/student", userControler.creatUser);

router.post("/investor", userControler.creatUser);

router.post("/login", userControler.login);

router.get("/me", userAuth, userControler.getProfile);

router.put("/", userAuth, userControler.updateUser);

router.delete("/", userControler.deleteUser);

module.exports = { userRoute: router };
