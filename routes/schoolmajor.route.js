const express = require("express");
const {schoolMajorControllers} = require("../controllers/schoolmajor.controller");

const router = express.Router();

router.get("/", schoolMajorControllers.findAllSchoolMajor)

router.get("/:majorId/:schoolId", schoolMajorControllers.findOneSchoolMajor)

router.post("/", schoolMajorControllers.createNewSchoolMajor)

router.put("/:majorId/:schoolId", schoolMajorControllers.updateSchoolMajor)

module.exports = { schoolMajorRoute: router }