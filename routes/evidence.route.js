const express = require("express");
const EvidenceController = require("../controllers/image.controller");

const router = express.Router();

router.get("/:id", EvidenceController.getById);

router.post("/", EvidenceController.createImage);

router.put("/:id", EvidenceController.updateImage);

router.delete("/:id", EvidenceController.deleteImage);

module.exports = { evidenceRouter: router };
