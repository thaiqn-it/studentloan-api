const express = require("express");
const universityController = require("../controllers/school.controller");

const router = express.Router();

router.get("/", universityController.findAllUniversity);

router.post("/", universityController.createSchool);

module.exports = { schoolRouter: router };
