const express = require("express");
const {majorController} = require("../controllers/major.controller");

const router = express.Router();

router.get("/", majorController.findAllMajor)

router.get("/:id", majorController.findOneMajor)

router.post("/", majorController.createNewMajor)

router.post("/:id", majorController.createSubMajor)

router.put("/:id", majorController.updateMajor)

module.exports = { majorRoute: router }