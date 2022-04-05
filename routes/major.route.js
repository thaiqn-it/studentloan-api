const express = require("express");
const {majorController} = require("../controllers/major.controller");

const router = express.Router();

router.get("/school/:id", majorController.findAllMajor)

router.post("/", majorController.createNewMajor)

router.put("/updateMajors/:id", majorController.updateMajor)

module.exports = { majorRoute: router }