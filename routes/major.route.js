const express = require("express");
const {majorController} = require("../controllers/major.controller");

const router = express.Router();

router.get("/:id", majorController.findAllMajor)

router.post("/", majorController.createNewMajor)

router.put("/updateMajors", majorController.updateMajor)

module.exports = { majorRoute: router }