const express = require("express");

const router = express.Router();

const schoolController  = require("../controllers/school.controller");

router.get("/", schoolController.findAllUniversity);

module.exports = { schoolRouter: router };