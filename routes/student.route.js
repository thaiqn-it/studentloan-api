const express = require("express");
const { studentController } = require("../controllers/student.controller");

const router = express.Router();

router.get("/",studentController.findAll);

router.get("/:id", studentController.findById);

router.get("/findByUserId/:id", studentController.findByUserId);

router.post("/",studentController.create);

router.put("/:id" , studentController.updateById)

router.get("/profile", studentController.getStudentProfile)

module.exports = { studentRouter : router };