const express = require("express");
const { studentController } = require("../controllers/student.controller");
const { studentAuth, userAuth } = require("../middlewares/jwt_auth");

const router = express.Router();

router.get("/profile", studentAuth, studentController.getStudentProfile);

router.get("/", studentController.findAll);

router.get("/:id", studentController.findById);

router.get("/findByUserId/:id", studentController.findByUserId);

router.post("/", studentController.create);

router.put("/:id", studentController.updateById);

router.put("/profile/:id", studentAuth, studentController.updateStudentProfile);

module.exports = { studentRouter: router };
