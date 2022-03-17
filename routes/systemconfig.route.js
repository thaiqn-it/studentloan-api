const express = require("express");
const { systemConfigController } = require("../controllers/systemconfig.controller");

const router = express.Router();

router.get("/",systemConfigController.findAll);

router.get("/:type", systemConfigController.findByType);

module.exports = { systemConfigRouter : router };