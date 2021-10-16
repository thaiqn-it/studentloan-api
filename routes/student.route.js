const express = require("express");
const { studentController } = require("../controllers/student.controller");

const router = express.Router();

router.get("/",studentController.findAll);

router.get("/:id", studentController.findById);

router.post("/",studentController.create);

router.put("/:id" , studentController.updateById)

module.exports = { studentRouter : router };