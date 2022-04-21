const express = require("express");
const {majorController} = require("../controllers/major.controller");

const router = express.Router();

router.get("/checkDuplicate/:name", majorController.isDuplicatedName)

router.get("/:id", majorController.getOne)

router.get("/school/:id", majorController.findAllMajor)

router.get("/", majorController.getAll)

router.post("/", majorController.createNewMajor)

router.put("/updateMajors/:id", majorController.updateMajor)

module.exports = { majorRoute: router }