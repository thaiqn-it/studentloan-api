const express = require("express");
const { reportController } = require("../controllers/report.controller");

const router = express.Router();

router.get("/:id", reportController.getReport);

router.post("/", reportController.createReport);

router.delete("/", reportController.deleteReport);

router.put("/:id", reportController.updateReport);

module.exports = { reportRouter: router };
