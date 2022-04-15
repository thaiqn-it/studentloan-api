const express = require("express");
const { loanMediaController } = require("../controllers/loanMedia.controller");

const router = express.Router();

router.get("/loan/:id/evidence" , loanMediaController.findAllEvidenceByLoanId)

router.put("/:id" , loanMediaController.updateLoanMedia)

router.post("/" , loanMediaController.createLoanMedia)

module.exports = { loanMediaRoute : router };