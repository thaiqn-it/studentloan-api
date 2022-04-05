const express = require("express");
const { contractController } = require("../controllers/contract.controller");

const router = express.Router();

router.get("/loan/:id", contractController.findByLoanId);

module.exports = { contractRoute: router };
