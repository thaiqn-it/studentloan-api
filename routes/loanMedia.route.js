const express = require("express");
const { loanMediaController } = require("../controllers/loanMedia.controller");

const router = express.Router();

router.get("/loan/:id/evidence" , loanMediaController.findAllEvidenceByLoanId)

module.exports = { loanMediaRoute : router };