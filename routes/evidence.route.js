const express = require("express");
const EvidenceController = require("../controllers/evidence.controller");

const router = express.Router();

router.get("/:id", EvidenceController.getById);

router.post("/", EvidenceController.createEvidence);

router.put("/:id", EvidenceController.updateEvidence);

router.delete("/:id", EvidenceController.deleteEvidence);

module.exports = { evidenceRoute: router };
