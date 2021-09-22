const express = require("express");
const {schoolControllers} = require("../controllers/school.controller");

const router = express.Router();

router.get("/", schoolControllers.findAllSchool)

router.get("/:id", schoolControllers.findOneSchool)

router.post("/", schoolControllers.createNewSchool)

router.put("/:id", schoolControllers.updateSchool)

module.exports = { schoolRoute: router }